const bcrypt = require("bcryptjs");
const jwtTokenGenerator = require("../utils/jwtTokenGenerator");
const jwtTokenValidator = require("../utils/jwtTokenValidator");
const User = require("../models/UserModel");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwtTokenGenerator(user.id);
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" || false, sameSite: "lax", });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyToken = (req, res) => {
  try {
    const tokenValidity = jwtTokenValidator(req);
    if (!tokenValidity) {
      return res.status(401).json({ valid: false, message: "Unauthorized" });
    }
    res.status(200).json({ valid: true, message: "Authorized" });
  } catch (error) {
    res.status(401).json({ valid: false, message: "Unauthorized: Invalid token" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
