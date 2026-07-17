// middleware/errorMiddleware.js

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);   // For debugging

    // Default error response
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle MongoDB duplicate key error (like same email)
    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value entered";
    }

    // Handle invalid ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

export default errorHandler;