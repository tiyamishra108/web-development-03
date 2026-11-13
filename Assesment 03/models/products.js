const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            minlength: [3, "Product name must be at least 3 characters"]
        },

        description: {
            type: String,
            required: [true, "Product description is required"]
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"]
        },

        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true
        },

        stockQuantity: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"],
            default: 0
        },

        minimumStockLevel: {
            type: Number,
            required: [true, "Minimum stock level is required"],
            min: [0, "Minimum stock level cannot be negative"],
            default: 5
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;