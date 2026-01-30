const { clerkMiddleware, getAuth, requireAuth } = require('@clerk/express');

/**
 * Clerk middleware - adds auth to all requests
 * Use this at the app level
 */
const clerkAuthMiddleware = clerkMiddleware();

/**
 * Authentication middleware using Clerk
 * Requires valid authentication, returns 401 if not authenticated
 */
const authMiddleware = (req, res, next) => {
    const auth = getAuth(req);

    if (!auth.userId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: Authentication required'
        });
    }

    // Attach auth to request for downstream use
    req.auth = {
        userId: auth.userId,
        sessionId: auth.sessionId
    };

    next();
};

/**
 * Optional auth middleware - continues even without valid token
 */
const optionalAuth = (req, res, next) => {
    try {
        const auth = getAuth(req);

        if (auth.userId) {
            req.auth = {
                userId: auth.userId,
                sessionId: auth.sessionId
            };
        }

        next();
    } catch (error) {
        // Continue without auth on error
        next();
    }
};

module.exports = {
    clerkAuthMiddleware,
    authMiddleware,
    optionalAuth,
    requireAuth
};
