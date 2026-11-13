const express = require("express");
const router = express.Router();

const Product = require("../Assesment 03/models/Product");
const validateProduct = require("../Assesment 03/middleware/validateProduct");

// 1. CREATE PRODUCT
router.post("/", validateProduct, async (req, res) => {
    try {
        const product = new Product(req.body);

        const savedProduct = await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: savedProduct
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// 2. GET ALL PRODUCTS - FILTERING, SORTING & PAGINATION
router.get("/", async (req, res) => {
    try {
        const {
            category,
            search,
            sortBy = "createdAt",
            order = "desc",
            page = 1,
            limit = 10
        } = req.query;

        // Filtering
        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Sorting
        const allowedSortFields = [
            "name",
            "price",
            "category",
            "stockQuantity",
            "createdAt"
        ];

        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

        const sortOrder = order === "asc" ? 1 : -1;

        const sortOptions = {
            [sortField]: sortOrder
        };

        // Pagination
        const pageNumber = Math.max(1, parseInt(page) || 1);
        const limitNumber = Math.min(
            100,
            Math.max(1, parseInt(limit) || 10)
        );

        const skip = (pageNumber - 1) * limitNumber;

        // Fetch Products
        const products = await Product.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNumber);

        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            totalProducts,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProducts / limitNumber),
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// 3. GET SINGLE PRODUCT BY ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// 4. UPDATE PRODUCT
router.put("/:id", validateProduct, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// 5. DELETE PRODUCT
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// STOCK MANAGEMENT - SAFE ATOMIC UPDATE
router.patch("/:id/stock", async (req, res) => {
    try {
        const { action, quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }

        if (!["restock", "sale"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Action must be restock or sale"
            });
        }

        let product;

        if (action === "restock") {
            product = await Product.findByIdAndUpdate(
                req.params.id,
                { $inc: { stockQuantity: quantity } },
                { new: true, runValidators: true }
            );
        } else {
            product = await Product.findOneAndUpdate(
                {
                    _id: req.params.id,
                    stockQuantity: { $gte: quantity }
                },
                { $inc: { stockQuantity: -quantity } },
                { new: true, runValidators: true }
            );
        }

        if (!product) {
            const existingProduct = await Product.findById(req.params.id);

            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            return res.status(400).json({
                success: false,
                message: "Insufficient stock available"
            });
        }

        res.status(200).json({
            success: true,
            message: `Stock ${action} successful`,
            data: {
                name: product.name,
                stockQuantity: product.stockQuantity
            }
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 7. LOW STOCK ALERT REPORT
router.get("/reports/low-stock", async (req, res) => {
    try {

        const lowStockProducts = await Product.find({
            $expr: {
                $lte: ["$stockQuantity", "$minimumStockLevel"]
            }
        });

        res.status(200).json({
            success: true,
            count: lowStockProducts.length,
            message: "Low stock report generated successfully",
            data: lowStockProducts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 9. CATEGORY-WISE INVENTORY SUMMARY
router.get("/reports/category-summary", async (req, res) => {
    try {
        const categorySummary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalProducts: { $sum: 1 },
                    totalStock: { $sum: "$stockQuantity" },
                    totalInventoryValue: {
                        $sum: {
                            $multiply: ["$price", "$stockQuantity"]
                        }
                    },
                    averagePrice: { $avg: "$price" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            count: categorySummary.length,
            data: categorySummary
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;