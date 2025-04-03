const Fitness = require("../models/FitnessModel");

// Create a new fitness entry
exports.createFitnessEntry = async (req, res) => {
    try {
        const { userId, exerciseType, duration, caloriesBurned, heartRate, steps } = req.body;

        if (!userId || !exerciseType || !duration || !caloriesBurned) {
            return res.status(400).json({ error: "Required fields are missing." });
        }

        const fitnessEntry = new Fitness({ userId, exerciseType, duration, caloriesBurned, heartRate, steps });
        await fitnessEntry.save();

        res.status(201).json({ message: "Fitness entry created successfully", fitnessEntry });
    } catch (error) {
        console.error("Error creating fitness entry:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all fitness entries
exports.getAllFitnessEntries = async (req, res) => {
    try {
        const fitnessEntries = await Fitness.find();
        res.json(fitnessEntries);
    } catch (error) {
        res.status(500).json({ error: "Error fetching fitness entries" });
    }
};

// Get a single fitness entry by ID
exports.getFitnessEntryById = async (req, res) => {
    try {
        const fitnessEntry = await Fitness.findById(req.params.id);
        if (!fitnessEntry) return res.status(404).json({ error: "Fitness entry not found" });
        res.json(fitnessEntry);
    } catch (error) {
        res.status(500).json({ error: "Error fetching fitness entry" });
    }
};

// Update a fitness entry
exports.updateFitnessEntry = async (req, res) => {
    try {
        const fitnessEntry = await Fitness.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!fitnessEntry) return res.status(404).json({ error: "Fitness entry not found" });
        res.json(fitnessEntry);
    } catch (error) {
        res.status(500).json({ error: "Error updating fitness entry" });
    }
};

// Delete a fitness entry
exports.deleteFitnessEntry = async (req, res) => {
    try {
        const fitnessEntry = await Fitness.findByIdAndDelete(req.params.id);
        if (!fitnessEntry) return res.status(404).json({ error: "Fitness entry not found" });
        res.json({ message: "Fitness entry deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting fitness entry" });
    }
};
