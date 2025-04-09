const express = require("express");
const router = express.Router();
const goalController = require("../controllers/fitnessGoalsController");
const authMiddleware = require("../middleware/authMiddleware");

router.post('/', authMiddleware, goalController.createGoal);
router.get('/', authMiddleware, goalController.getGoals);
router.get('/', authMiddleware, goalController.getGoalById);
router.put('/', authMiddleware, goalController.updateGoal);
router.delete('/', authMiddleware, goalController.deleteGoal);

module.exports = router;