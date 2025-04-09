const Goal = require('../models/FitnessGoalsModel');

// Create a new goal
exports.createGoal = async (req, res) => {
    try {
        const goal = new Goal({ ...req.body, user: req.user.userId });
        await goal.save();
        res.status(201).json(goal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all goals for a user
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.userId });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single goal
exports.getGoalById = async (req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, user: req.user.userId });
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a goal
exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            req.body,
            { new: true }
        );
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json(goal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json({ message: 'Goal deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};