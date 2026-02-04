const mongoose=require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    // ---------- Auth ----------
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    phone: {
      type: String
    },

    // ---------- Profile ----------
    name: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      maxlength: 300
    },
    profileImage: {
      type: String
    },

    city: {
      type: String,
      index: true
    },

    // ---------- Business Role ----------
    role: {
      type: String,
      enum: ["IDEA_OWNER", "CO_FOUNDER", "INVESTOR"],
      default: "CO_FOUNDER"
    },

    skills: [
      {
        type: String,
        index: true
      }
    ],

    experienceLevel: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "EXPERT"]
    },

    // ---------- Commitment ----------
    availability: {
      type: String,
      enum: ["PART_TIME", "FULL_TIME"]
    },

    investmentRange: {
      min: Number,
      max: Number
    },

    // ---------- Matching Preferences ----------
    lookingFor: {
      roles: [String], // IDEA_OWNER / CO_FOUNDER / INVESTOR
      skills: [String],
      city: String
    },

    // ---------- System ----------
    isAdmin: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
