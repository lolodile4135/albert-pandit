const Interest = require("../models/InterestModel");
const Post = require("../models/PostModel");
const User = require("../models/UserModel");

// Toggle interest - add if not exists, remove if exists
const toggleInterest = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;

        // Validate user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Validate post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: "Post not found" 
            });
        }

        // Check if user already showed interest
        const existingInterest = await Interest.findOne({ 
            post: postId, 
            user: userId 
        });

        if (existingInterest) {
            // Remove interest
            await Interest.findByIdAndDelete(existingInterest._id);
            
            // Decrement interestsCount
            await Post.findByIdAndUpdate(postId, {
                $inc: { interestsCount: -1 }
            });

            return res.status(200).json({
                success: true,
                message: "Interest removed successfully",
                isInterested: false,
                interestsCount: Math.max(0, post.interestsCount - 1)
            });
        } else {
            // Add interest
            const newInterest = await Interest.create({
                post: postId,
                user: userId
            });

            // Increment interestsCount
            await Post.findByIdAndUpdate(postId, {
                $inc: { interestsCount: 1 }
            });

            return res.status(200).json({
                success: true,
                message: "Interest added successfully",
                isInterested: true,
                interestsCount: post.interestsCount + 1,
                interest: newInterest
            });
        }
    } catch (error) {
        console.error("TOGGLE INTEREST ERROR:", error);
        
        // Handle duplicate key error (shouldn't happen due to unique index, but just in case)
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "Interest already exists" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Server error, interest could not be toggled" 
        });
    }
};

// Get interest count for a post
const getInterestCount = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: "Post not found" 
            });
        }

        // Get actual count from Interest collection (more accurate)
        const count = await Interest.countDocuments({ post: postId });

        return res.status(200).json({
            success: true,
            message: "Interest count fetched successfully",
            interestsCount: count,
            postId: postId
        });
    } catch (error) {
        console.error("GET INTEREST COUNT ERROR:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error, interest count could not be fetched" 
        });
    }
};

// Check if current user is interested in a post
const checkUserInterest = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;

        const interest = await Interest.findOne({ 
            post: postId, 
            user: userId 
        });

        return res.status(200).json({
            success: true,
            message: "User interest status fetched successfully",
            isInterested: !!interest,
            postId: postId
        });
    } catch (error) {
        console.error("CHECK USER INTEREST ERROR:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error, user interest status could not be fetched" 
        });
    }
};

// Get all users interested in a post (optional - for post owner)
const getInterestedUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;

        // Verify post exists and user is the owner
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: "Post not found" 
            });
        }

        if (post.owner.toString() !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Not authorized. Only post owner can view interested users" 
            });
        }

        // Get all interests with user details
        const interests = await Interest.find({ post: postId })
            .populate('user', 'name email profileImage bio role skills')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Interested users fetched successfully",
            count: interests.length,
            users: interests.map(interest => ({
                user: interest.user,
                interestedAt: interest.createdAt
            }))
        });
    } catch (error) {
        console.error("GET INTERESTED USERS ERROR:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error, interested users could not be fetched" 
        });
    }
};

module.exports = {
    toggleInterest,
    getInterestCount,
    checkUserInterest,
    getInterestedUsers
};

