const axios = require('axios');
const config = require('../config');

const INSTAGRAM_API_BASE = 'https://graph.instagram.com/v18.0';

/**
 * Send a DM reply to an Instagram user
 */
const sendDirectMessage = async (recipientId, message) => {
    try {
        const response = await axios.post(
            `${INSTAGRAM_API_BASE}/me/messages`,
            {
                recipient: { id: recipientId },
                message: { text: message }
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.meta.igAccessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`✅ Message sent to ${recipientId}`);
        return response.data;
    } catch (error) {
        console.error('❌ Failed to send message:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Reply to a comment on a media post
 */
const replyToComment = async (commentId, message) => {
    try {
        const response = await axios.post(
            `${INSTAGRAM_API_BASE}/${commentId}/replies`,
            {
                message
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.meta.igAccessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`✅ Reply sent to comment ${commentId}`);
        return response.data;
    } catch (error) {
        console.error('❌ Failed to reply to comment:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Get Instagram profile information
 */
const getProfile = async () => {
    try {
        const response = await axios.get(
            `${INSTAGRAM_API_BASE}/me`,
            {
                params: {
                    fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count',
                    access_token: config.meta.igAccessToken
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('❌ Failed to get profile:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Get recent media posts
 */
const getRecentMedia = async (limit = 10) => {
    try {
        const response = await axios.get(
            `${INSTAGRAM_API_BASE}/me/media`,
            {
                params: {
                    fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count',
                    limit,
                    access_token: config.meta.igAccessToken
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('❌ Failed to get media:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = {
    sendDirectMessage,
    replyToComment,
    getProfile,
    getRecentMedia
};
