/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.stack);

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let details = undefined;

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        details = err.details;
    }

    if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    }

    if (err.code === '23505') {
        // PostgreSQL unique violation
        statusCode = 409;
        message = 'Resource already exists';
    }

    if (err.code === '23503') {
        // PostgreSQL foreign key violation
        statusCode = 400;
        message = 'Related resource not found';
    }

    // Don't leak error details in production
    const response = {
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            details,
            stack: err.stack
        })
    };

    res.status(statusCode).json(response);
};

/**
 * Create a custom error with status code
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    errorHandler,
    AppError
};
