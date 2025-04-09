const mongoose = require('mongoose');

const fitnessGoalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    type: {
        type: String,
        required: true
    },

    period: {
        type: String,
        default: 'Monthly'
    },

    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    unit: { type: String }, // e.g., 'kg', 'km', 'kcal', 'sessions', 'steps'

    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }, // auto-calculate for weekly/monthly if not provided

    completed: { type: Boolean, default: false },
    progress: { type: Number, default: 0 }, // % progress

    notes: String
});

module.exports = mongoose.model('FitnessGoal', fitnessGoalSchema);