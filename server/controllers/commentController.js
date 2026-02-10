const Post = require("../models/PostModel");
const User = require("../models/UserModel");
const Comment = require("../models/CommentModel");

const create_comment = async (req, res) => {
    try {
        const user_id = req.userId;
        const post_id = req.params.post_id;
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const { text } = req.body;

        //create new comment and save
        const new_comment = await Comment.create({
            post: post_id,
            user: user_id,
            text: text
        })

        // Append comment to post
        await Post.findByIdAndUpdate(
            post_id,
            { $push: { comments: new_comment._id } },
            { new: true }
        );

        // Populate user details before returning
        await new_comment.populate('user', 'name email profileImage role');

        return res.status(200).json({
            success: true,
            message: 'comment created successfully',
            comment: new_comment
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error, comment could not be created' });
    }
}

const edit_comment = async (req, res) => {

    try {
        const user_id = req.userId;
        const comment_id = req.params.comment_id;
        const { text } = req.body;
        const comment = await Comment.findById(comment_id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // Authorization check
        if (comment.user.toString() !== user_id) {
            return res.status(403).json({ message: "You are not allowed to edit this comment" });
        }
        comment.text = text;
        await comment.save();

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, comment could not be updated" });

    }
}

const delete_comment = async (req, res) => {
    try {
      const user_id = req.userId;
      const comment_id = req.params.comment_id;
  
      // Delete only if user owns the comment
      const deletedComment = await Comment.findOneAndDelete({
        _id: comment_id,
        user: user_id
      });
  
      if (!deletedComment) {
        return res.status(404).json({
          message: "Comment not found or not authorized"
        });
      }
  
      // Pull comment ID from post
      await Post.findByIdAndUpdate(
        deletedComment.post,
        { $pull: { comments: comment_id } }
      );
  
      res.status(200).json({
        success: true,
        message: "Comment deleted successfully"
      });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  

const get_comments = async (req, res) => {
    try {
        const post_id = req.params.post_id;
        const post = await Post.findById(post_id);
        
        if (!post) {
            return res.status(404).json({ 
                success: false,
                message: "Post not found" 
            });
        }

        // Get all comments for this post, populate user details
        const comments = await Comment.find({ post: post_id })
            .populate('user', 'name email profileImage role')
            .sort({ createdAt: -1 }); // Newest first

        return res.status(200).json({
            success: true,
            message: 'Comments fetched successfully',
            comments: comments,
            count: comments.length
        });

    } catch (error) {
        console.error('GET COMMENTS ERROR:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error, comments could not be fetched',
            error: error.message 
        });
    }
}

module.exports = { create_comment, edit_comment, delete_comment, get_comments };