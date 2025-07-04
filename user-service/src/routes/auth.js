const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { model } = require("mongoose");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  console.log("🔥 REGISTER HIT!");
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    console.log("✅ User saved successfully");
    res.status(201).json({ message: "User registered." });
  } catch (err) {
    console.error("❌ Error saving user:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

// GET /api/users?role=expert
router.get('/users', async (req, res) => {
  const role = req.query.role;
  try {
    const users = role
      ? await User.find({ role })
      : await User.find();
    res.json(users.map(u => ({ name: u.name, email: u.email, role: u.role })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
