const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema(
    {
        // ---------- Ownership ----------
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // ---------- Idea ----------
        title: {
            type: String,
            required: true,
            maxlength: 100
        },

        description: {
            type: String,
            required: true,
            maxlength: 1000
        },

        category: {
            type: String,
            enum: [
                "FOOD",
                "RETAIL",
                "SERVICE",
                "TECH",
                "LOCAL_TRADE",
                "OTHER"
            ],
            index: true
        },

        // ---------- What they need ----------
        lookingFor: {
            roles: [String],     // CO_FOUNDER / INVESTOR / PARTNER
            skills: [String],    // Marketing, Finance, Cooking
            count: {
                type: Number,
                default: 1
            }
        },

        // ---------- Location ----------
        city: {
            type: String,
            index: true
        },

        isRemote: {
            type: Boolean,
            default: false
        },

        // ---------- Commitment ----------
        commitment: {
            type: String,
            enum: ["PART_TIME", "FULL_TIME"]
        },

        investmentRequired: {
            min: Number,
            max: Number
        },

        // ---------- Status ----------
        status: {
            type: String,
            enum: ["OPEN", "MATCHED", "CLOSED"],
            default: "OPEN",
            index: true
        },

        // ---------- Engagement ----------
        interestsCount: {
            type: Number,
            default: 0
        },

        // ---------- Moderation ----------
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
