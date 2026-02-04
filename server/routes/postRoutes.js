const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createPost, getMyPosts } = require('../controllers/postController');
const router = express.Router();

router.post('/create_post', authMiddleware, createPost);
router.get("/get_my_posts", authMiddleware, getMyPosts)

module.exports = router;