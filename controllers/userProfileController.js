const UserProfile = require("../models/UserProfileModel");

exports.addUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Comes from auth middleware
        const { gender, bloodGroup, height, address, bio, profilePicture } = req.body;

        // Check if profile exists
        let profile = await UserProfile.findOne({ user: userId });

        if (profile) {
            // Update existing profile
            profile.gender = gender || profile.gender;
            profile.bloodGroup = bloodGroup || profile.bloodGroup;
            profile.height = height || profile.height;
            profile.address = address || profile.address;
            profile.bio = bio || profile.bio;
            profile.profilePicture = profilePicture || profile.profilePicture;

            await profile.save();
            return res.status(200).json({ message: "Profile updated", profile });
        }

        // Create new profile
        profile = new UserProfile({
            user: userId,
            gender,
            bloodGroup,
            height,
            address,
            bio,
            profilePicture,
        });

        await profile.save();
        res.status(201).json({ message: "Profile created", profile });
    } catch (error) {
        console.error("Profile upsert error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Comes from auth middleware

        const profile = await UserProfile.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
