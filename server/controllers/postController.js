const Post = require("../models/PostModel")
const User = require("../models/UserModel")

const createPost = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        const { title, description } = req.body;
        const newPost = await Post.create({
            owner: userId,
            title,
            description
        })
        return res.status(200).json({
            success: true,
            message: 'Post created successfully',
            post: newPost

        });

    } catch (error) {
        res.status(500).json({ message: 'Server error, Post could not be created' });
    }
}

const getMyPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        const my_posts = await Post.find({ owner: userId });
        if(!my_posts){
            return res.status(404).json({ success: false, message: "posts not found" })
        }
        return res.status(200).json({
            success: true,
            message: 'posts fetched Successfully',
            my_posts: my_posts

        });
    } catch (error) {
        res.status(500).json({ message: 'Server error, Post could not be fetched' });
    }
}



module.exports = { createPost, getMyPosts }