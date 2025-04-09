const bcrypt = require("bcryptjs");
const jwtTokenGenerator = require("../utils/jwtTokenGenerator");
const jwtTokenValidator = require("../utils/jwtTokenValidator");
const User = require("../models/UserModel");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, dob } = req.body;

    // Required fields check
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    // Email uniqueness
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Phone number validation (E.164)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: "Phone number must be in E.164 format." });
    }

    // DOB validation
    if (dob) {
      const parsedDOB = new Date(dob);
      const now = new Date();

      if (isNaN(parsedDOB.getTime())) {
        return res.status(400).json({ error: "Invalid date of birth." });
      }

      const age = now.getFullYear() - parsedDOB.getFullYear();
      const monthDiff = now.getMonth() - parsedDOB.getMonth();
      const dayDiff = now.getDate() - parsedDOB.getDate();

      const isBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
      const finalAge = isBirthdayPassed ? age : age - 1;

      if (finalAge < 13) {
        return res.status(400).json({ error: "User must be at least 13 years old." });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      dob,
    });
    await user.save();

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
    res.status(200).json({ message: "Login successful", userData: { id: user.id, name: user.name, email: user.email, login: true, token: token } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || false,
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
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
