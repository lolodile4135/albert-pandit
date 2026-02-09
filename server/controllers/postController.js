const Post = require("../models/PostModel");
const User = require("../models/UserModel");
const Comment = require("../models/CommentModel");

const createPost = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        
        const {
            title,
            description,
            category,
            lookingFor,
            city,
            isRemote,
            commitment,
            investmentRequired
        } = req.body;

        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({ 
                success: false, 
                message: "Title and description are required" 
            });
        }

        // Build post data
        const postData = {
            owner: userId,
            title,
            description
        };

        // Add optional fields if provided
        if (category) postData.category = category;
        if (lookingFor) postData.lookingFor = lookingFor;
        if (city) postData.city = city;
        if (isRemote !== undefined) postData.isRemote = isRemote;
        if (commitment) postData.commitment = commitment;
        if (investmentRequired) postData.investmentRequired = investmentRequired;

        const newPost = await Post.create(postData);
        
        // Populate owner details for response
        await newPost.populate('owner', 'name email profileImage role');
        
        return res.status(200).json({
            success: true,
            message: 'Post created successfully',
            post: newPost
        });

    } catch (error) {
        console.error('CREATE POST ERROR:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error, Post could not be created',
            error: error.message 
        });
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
        if (!my_posts) {
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

const deletePost = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        const postId = req.params.post_id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // 2️⃣ Authorization check
        if (post.owner.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // 3️⃣ Delete all comments of this post
        await Comment.deleteMany({ post: postId });
        // 4️⃣ Delete the post
        await Post.findByIdAndDelete(postId);
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error("DELETE POST ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createPost, getMyPosts, deletePost }