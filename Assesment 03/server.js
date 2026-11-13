const errorMiddleware = require("./middleware/errorMiddleware");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use("/api/products", productRoutes);
app.use(errorMiddleware);

// Database Connection and Server Start
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

// Test Route
app.get("/", (req, res) => {
    res.send("Inventory Management System API is Running!");
});

startServer();