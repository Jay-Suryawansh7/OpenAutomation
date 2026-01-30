/**
 * 404 Not Found middleware
 * Catches requests that don't match any route
 */
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        path: req.originalUrl
    });
};

module.exports = {
    notFound
};
