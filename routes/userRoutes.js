const express = require("express");
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, UserController.createUser);
router.get("/", authMiddleware, UserController.getAllUsers);
router.get("/:id", authMiddleware, UserController.getUserById);
router.put("/:id", authMiddleware, UserController.updateUser);
router.delete("/:id", authMiddleware, UserController.deleteUser);

module.exports = router;