import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret";

// 🚀 SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  try {
    const { name, email, age, address, state, password, confirmPassword } = req.body;

    if (!name || !email || !age || !address || !state || !password || !confirmPassword) {
      return res.status(400).json({ success: false, error: "All fields are required!" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters long" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Passwords do not match!" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, error: "User already exists!" });

    // ⚠️ REMOVE EXTRA HASHING (Handled in the model)
    user = new User({ name, email, age, address, state, password }); 
    await user.save();

    console.log(`✅ New user registered: ${email}`);
    res.status(201).json({ success: true, message: "User registered successfully!" });

  } catch (error) {
    console.error("❌ Signup Error:", error.message);
    res.status(500).json({ success: false, error: "Server error. Please try again later." });
  }
});

// 🚀 LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login Attempt:", { email, password });

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required!" });
    }

    // ✅ Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found!");
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    console.log("✅ User found:", user.email);
    console.log("🔑 Hashed Password in DB:", user.password);

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log("🔄 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch!");
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    console.log("✅ Login successful! Token generated.");
    res.json({ token, user: { id: user._id, email: user.email } });

  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

export default router;
