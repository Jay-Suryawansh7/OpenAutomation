module.exports = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

    database: {
        url: process.env.DATABASE_URL,
    },

    clerk: {
        secretKey: process.env.CLERK_SECRET_KEY,
    },

    meta: {
        appSecret: process.env.META_APP_SECRET,
        verifyToken: process.env.META_VERIFY_TOKEN,
        igAccessToken: process.env.IG_ACCESS_TOKEN,
    }
};
