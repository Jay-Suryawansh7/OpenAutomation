const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagram.controller');
const { authMiddleware } = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// GET /api/instagram/media
router.get('/media', instagramController.getMedia);

// GET /api/instagram/profile
router.get('/profile', instagramController.getProfile);

module.exports = router;
