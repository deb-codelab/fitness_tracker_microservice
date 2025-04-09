const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One profile per user
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        height: {
            type: Number, // in centimeters (cm)
            min: 30,
            max: 300,
        },
        address: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        profilePicture: {
            type: String, // URL to profile image
        },
    },
    {
        timestamps: true,
    }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = UserProfile;
