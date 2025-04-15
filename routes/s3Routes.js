const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const s3Controller = require("../controllers/s3Controller");


router.get("/generate-upload-url", authMiddleware, s3Controller.getSignedURL);

module.exports = router;