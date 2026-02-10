const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createPost, getMyPosts, deletePost, getRelevantPosts } = require('../controllers/postController');
const router = express.Router();

router.post('/create_post', authMiddleware, createPost);
router.get("/get_my_posts", authMiddleware, getMyPosts);
router.get("/get_relevant_posts", authMiddleware, getRelevantPosts);
router.delete("/delete_post/:post_id", authMiddleware, deletePost);

module.exports = router;