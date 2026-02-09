const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    toggleInterest,
    getInterestCount,
    checkUserInterest,
    getInterestedUsers
} = require('../controllers/interestController');

const router = express.Router();

// Toggle interest (add/remove) - requires authentication
router.post('/toggle/:postId', authMiddleware, toggleInterest);

// Get interest count for a post - public endpoint
router.get('/count/:postId', getInterestCount);

// Check if current user is interested - requires authentication
router.get('/check/:postId', authMiddleware, checkUserInterest);

// Get list of users interested in a post - requires authentication (post owner only)
router.get('/users/:postId', authMiddleware, getInterestedUsers);

module.exports = router;

