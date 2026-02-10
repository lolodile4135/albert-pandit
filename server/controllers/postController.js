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

// Calculate relevance score for a post based on user profile
const calculateRelevanceScore = (post, user) => {
    let score = 0;
    const scoreBreakdown = {
        cityMatch: 0,
        skillsOverlap: 0,
        availability: 0,
        investmentFit: 0,
        profileCompleteness: 0
    };

    // 1. City Match (40% - 40 points)
    if (post.isRemote) {
        // Remote posts get full city match score
        scoreBreakdown.cityMatch = 40;
        score += 40;
    } else if (post.city && user.city) {
        // Exact city match
        if (post.city.toLowerCase().trim() === user.city.toLowerCase().trim()) {
            scoreBreakdown.cityMatch = 40;
            score += 40;
        } else {
            // Partial match (same state/region) - give partial score
            const postCityParts = post.city.toLowerCase().split(',');
            const userCityParts = user.city.toLowerCase().split(',');
            if (postCityParts.length > 1 && userCityParts.length > 1) {
                if (postCityParts[postCityParts.length - 1].trim() === 
                    userCityParts[userCityParts.length - 1].trim()) {
                    scoreBreakdown.cityMatch = 20; // Half score for same state
                    score += 20;
                }
            }
        }
    }

    // 2. Skills Overlap (30% - 30 points)
    if (post.lookingFor && post.lookingFor.skills && post.lookingFor.skills.length > 0 && 
        user.skills && user.skills.length > 0) {
        const postSkills = post.lookingFor.skills.map(s => s.toLowerCase().trim());
        const userSkills = user.skills.map(s => s.toLowerCase().trim());
        
        const matchingSkills = postSkills.filter(skill => 
            userSkills.some(userSkill => 
                userSkill.includes(skill) || skill.includes(userSkill)
            )
        );
        
        if (matchingSkills.length > 0) {
            const overlapRatio = matchingSkills.length / postSkills.length;
            scoreBreakdown.skillsOverlap = Math.min(30, overlapRatio * 30);
            score += scoreBreakdown.skillsOverlap;
        }
    }

    // 3. Availability Match (15% - 15 points)
    if (post.commitment && user.availability) {
        if (post.commitment === user.availability) {
            scoreBreakdown.availability = 15;
            score += 15;
        } else if (post.commitment === 'PART_TIME' && user.availability === 'FULL_TIME') {
            // Full-time user can do part-time (partial score)
            scoreBreakdown.availability = 10;
            score += 10;
        }
    }

    // 4. Investment Fit (10% - 10 points)
    if (post.investmentRequired && user.investmentRange) {
        const postMin = post.investmentRequired.min || 0;
        const postMax = post.investmentRequired.max || Infinity;
        const userMin = user.investmentRange.min || 0;
        const userMax = user.investmentRange.max || Infinity;

        // Check if ranges overlap
        if (userMin <= postMax && userMax >= postMin) {
            // Calculate overlap percentage
            const overlapMin = Math.max(userMin, postMin);
            const overlapMax = Math.min(userMax, postMax);
            const overlapRange = Math.max(0, overlapMax - overlapMin);
            const userRange = userMax - userMin;
            const postRange = postMax - postMin;

            if (userRange > 0 && postRange > 0) {
                const fitRatio = overlapRange / Math.min(userRange, postRange);
                scoreBreakdown.investmentFit = fitRatio * 10;
                score += scoreBreakdown.investmentFit;
            } else {
                scoreBreakdown.investmentFit = 10; // Perfect match if single value
                score += 10;
            }
        }
    }

    // 5. Profile Completeness (5% - 5 points)
    let completenessFields = 0;
    let totalFields = 0;

    // Check important fields
    const fieldsToCheck = [
        { field: user.name, weight: 1 },
        { field: user.bio, weight: 1 },
        { field: user.city, weight: 1 },
        { field: user.role, weight: 1 },
        { field: user.skills && user.skills.length > 0, weight: 1 },
        { field: user.experienceLevel, weight: 1 },
        { field: user.availability, weight: 1 },
        { field: user.investmentRange, weight: 1 }
    ];

    fieldsToCheck.forEach(({ field, weight }) => {
        totalFields += weight;
        if (field) {
            if (typeof field === 'boolean' && field) {
                completenessFields += weight;
            } else if (typeof field === 'object' && field !== null) {
                if (Object.keys(field).length > 0) {
                    completenessFields += weight;
                }
            } else if (field) {
                completenessFields += weight;
            }
        }
    });

    if (totalFields > 0) {
        const completenessRatio = completenessFields / totalFields;
        scoreBreakdown.profileCompleteness = completenessRatio * 5;
        score += scoreBreakdown.profileCompleteness;
    }

    return {
        totalScore: Math.round(score * 100) / 100, // Round to 2 decimal places
        breakdown: scoreBreakdown
    };
};

const getRelevantPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('+password');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Get all open posts excluding user's own posts
        const allPosts = await Post.find({ 
            status: 'OPEN',
            isActive: true,
            owner: { $ne: userId } // Exclude user's own posts
        })
        .populate('owner', 'name email profileImage role')
        .sort({ createdAt: -1 });

        // Calculate relevance score for each post
        const postsWithScores = allPosts.map(post => {
            const relevance = calculateRelevanceScore(post, user);
            return {
                ...post.toObject(),
                relevanceScore: relevance.totalScore,
                scoreBreakdown: relevance.breakdown
            };
        });

        // Sort by relevance score (descending)
        postsWithScores.sort((a, b) => b.relevanceScore - a.relevanceScore);

        return res.status(200).json({
            success: true,
            message: 'Relevant posts fetched successfully',
            posts: postsWithScores,
            count: postsWithScores.length
        });

    } catch (error) {
        console.error('GET RELEVANT POSTS ERROR:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error, relevant posts could not be fetched',
            error: error.message 
        });
    }
}

module.exports = { createPost, getMyPosts, deletePost, getRelevantPosts }