const validateProduct = (req, res, next) => {
    const {
        name,
        description,
        price,
        category,
        stockQuantity,
        minimumStockLevel
    } = req.body;

    // Required fields for creating a product
    if (req.method === "POST") {
        if (
            !name ||
            !description ||
            price === undefined ||
            !category ||
            stockQuantity === undefined ||
            minimumStockLevel === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All product fields are required"
            });
        }
    }

    // Validate product name
    if (name !== undefined &&
        (typeof name !== "string" || name.trim().length < 3)) {
        return res.status(400).json({
            success: false,
            message: "Product name must contain at least 3 characters"
        });
    }

    // Validate price
    if (price !== undefined &&
        (typeof price !== "number" || price < 0)) {
        return res.status(400).json({
            success: false,
            message: "Price must be a non-negative number"
        });
    }

    // Validate stock quantity
    if (stockQuantity !== undefined &&
        (!Number.isInteger(stockQuantity) || stockQuantity < 0)) {
        return res.status(400).json({
            success: false,
            message: "Stock quantity must be a non-negative integer"
        });
    }

    // Validate minimum stock level
    if (minimumStockLevel !== undefined &&
        (!Number.isInteger(minimumStockLevel) || minimumStockLevel < 0)) {
        return res.status(400).json({
            success: false,
            message: "Minimum stock level must be a non-negative integer"
        });
    }

    next();
};

module.exports = validateProduct;