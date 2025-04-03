const mongoose = require("mongoose");

const fitnessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    exerciseType: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    caloriesBurned: {
      type: Number,
      required: true,
    },
    heartRate: {
      type: Number, // Average heart rate during the workout
      required: false,
    },
    steps: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true, // Enables createdAt & updatedAt
  }
);

const Fitness = mongoose.model("Fitness", fitnessSchema);

module.exports = Fitness;
