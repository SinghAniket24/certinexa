const express = require("express");
const bcrypt = require("bcryptjs");

const Recepient = require("../models/recepient/recepient");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, walletAddress } = req.body;

    // Check existing email
    const existing = await Recepient.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create recepient
    const recepient = await Recepient.create({
      name,
      email,
      password: hashedPassword,
      walletAddress,
    });

    res.status(201).json({
      message: "Recepient registered successfully",
      recepient,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
