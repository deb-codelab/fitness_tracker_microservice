const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, dob } = req.body;

        // Required fields check
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required." });
        }

        // Email uniqueness
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        // Phone number validation (E.164)
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (phoneNumber && !phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ error: "Phone number must be in E.164 format." });
        }

        // DOB validation
        if (dob) {
            const parsedDOB = new Date(dob);
            const now = new Date();

            if (isNaN(parsedDOB.getTime())) {
                return res.status(400).json({ error: "Invalid date of birth." });
            }

            const age = now.getFullYear() - parsedDOB.getFullYear();
            const monthDiff = now.getMonth() - parsedDOB.getMonth();
            const dayDiff = now.getDate() - parsedDOB.getDate();

            const isBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
            const finalAge = isBirthdayPassed ? age : age - 1;

            if (finalAge < 13) {
                return res.status(400).json({ error: "User must be at least 13 years old." });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            dob,
        });

        await user.save();

        // Remove password before sending response
        const { password: _, ...userData } = user.toObject();
        res.status(201).json({ message: "User created successfully", user: userData });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
};

// Get a single user
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error updating user" });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
};
