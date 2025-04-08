const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Signup Route
router.post("/signup", authController.signup);

// Login Route
router.post("/login", authController.login);

// Logout Route
router.get("/logout", authController.logout);

// Verify Token Route
router.get("/verify-token", authController.verifyToken);

// Protected Route: Get User Profile
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
