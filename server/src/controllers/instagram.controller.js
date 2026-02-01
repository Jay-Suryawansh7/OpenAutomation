const instagramService = require('../services/instagram.service');

/**
 * Get recent media (reels/posts) from Instagram
 * @route GET /api/instagram/media
 */
const getMedia = async (req, res, next) => {
    try {
        const queryLimit = req.query.limit ? parseInt(req.query.limit) : 20;
        const media = await instagramService.getRecentMedia(queryLimit);

        res.json({
            success: true,
            data: media.data || [],
            paging: media.paging
        });
    } catch (error) {
        console.error('Error fetching Instagram media:', error);
        next(error);
    }
};

/**
 * Get profile information
 * @route GET /api/instagram/profile
 */
const getProfile = async (req, res, next) => {
    try {
        const profile = await instagramService.getProfile();
        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMedia,
    getProfile
};
