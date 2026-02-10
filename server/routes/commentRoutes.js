const express = require("express")

//import local files
const authMiddleware = require('../middlewares/authMiddleware');
const { create_comment, edit_comment, delete_comment, get_comments } = require("../controllers/commentController")

const router = express.Router();

router.get("/get_comments/:post_id", get_comments); // Public endpoint - anyone can view comments
router.post("/create_comment/:post_id", authMiddleware, create_comment);
router.put("/edit_comment/:comment_id", authMiddleware, edit_comment);
router.delete("/delete_comment/:comment_id", authMiddleware, delete_comment);

module.exports = router