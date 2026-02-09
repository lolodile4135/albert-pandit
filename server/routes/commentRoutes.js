const express = require("express")

//import local files
const authMiddleware = require('../middlewares/authMiddleware');
const { create_comment, edit_comment, delete_comment } = require("../controllers/commentController")

const router = express.Router();

router.post("/create_comment/:post_id", authMiddleware, create_comment);
router.put("/edit_comment/:comment_id", authMiddleware, edit_comment);
router.delete("/delete_comment/:comment_id", authMiddleware, delete_comment);

module.exports = router