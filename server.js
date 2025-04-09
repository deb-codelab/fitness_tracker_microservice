const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const fitnessRoutes = require("./routes/fitnessRoutes");
const authRoutes = require("./routes/authRoutes");
const defaultRoutes = require("./routes/defaultRoutes");
const userRoutes = require("./routes/userRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const fitnessGoalsRoutes = require("./routes/fitnessGoalsRoute");

const app = express();
require('dotenv').config()

// Middleware for parsing cookies
app.use(cookieParser());
app.use(express.json());

//Enable CORS to allow credentials
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    credentials: true, // Allow sending cookies & authentication headers
  })
);

// Mount API routes for posts
app.use("/", defaultRoutes);

// Mount API Auth route
app.use("/api/auth", authRoutes);

// Mount user routes for users
app.use("/api/users", userRoutes);

// Mount user routes for user profile
app.use("/api/user-profile", userProfileRoutes);

// Mount fitness goals routes for user
app.use("/api/fitness-goals", fitnessGoalsRoutes);

// Sync database and start server
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Database connected!");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error);
  });