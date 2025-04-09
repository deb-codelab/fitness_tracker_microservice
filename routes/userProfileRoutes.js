const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userProfileController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, userProfileController.addUserProfile);
router.put("/", authMiddleware, userProfileController.addUserProfile);
router.get("/", authMiddleware, userProfileController.getUserProfile);

module.exports = router;
