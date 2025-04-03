const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const fitnessController = require("../controllers/fitnessController");

const router = express.Router();

router.post("/", authMiddleware, fitnessController.createFitnessEntry);
router.get("/", fitnessController.getAllFitnessEntries);
router.get("/:id", fitnessController.getFitnessEntryById);
router.put("/:id", authMiddleware, fitnessController.updateFitnessEntry);
router.delete("/:id", authMiddleware, fitnessController.deleteFitnessEntry);

module.exports = router;
