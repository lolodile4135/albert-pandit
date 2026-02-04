const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createPost, getMyPosts, deletePost } = require('../controllers/postController');
const router = express.Router();

router.post('/create_post', authMiddleware, createPost);
router.get("/get_my_posts", authMiddleware, getMyPosts);
router.delete("/delete_post/:post_id", authMiddleware, deletePost);

module.exports = router;