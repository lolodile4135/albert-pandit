const mongoose = require("mongoose");

const InterestSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        }
    },
    { timestamps: true }
);

// Compound index to ensure one user can only show interest once per post
InterestSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Interest", InterestSchema);

