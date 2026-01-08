const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // 1. Added JWT

// Import Models
const Recepient = require("../models/recepient/recepient");
const Certificate = require("../models/certificate/certificate"); // 2. Added Certificate Model

const router = express.Router();

// ---------------------------------------------------------
// MIDDLEWARE: Verify Recipient Token
// ---------------------------------------------------------
const authRecepient = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    // Make sure your .env has JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    req.recepientAuth = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("Token Verification Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ---------------------------------------------------------
// ROUTE: Register Recipient
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// ROUTE: Login Recipient (NEW)
// ---------------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const recepient = await Recepient.findOne({ email });
    if (!recepient) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, recepient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate Token
    const token = jwt.sign(
      { id: recepient._id, email: recepient.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: recepient.name,
        email: recepient.email,
        walletAddress: recepient.walletAddress
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------------------
// ROUTE: Get My Certificates (NEW)
// ---------------------------------------------------------
router.get("/my-certificates", authRecepient, async (req, res) => {
  try {
    const email = req.recepientAuth.email; // From middleware

    // Find certificates where 'recipientEmail' matches the logged-in user's email
    // Sort by newest first
    const certificates = await Certificate.find({ recipientEmail: email })
      .sort({ issuedAt: -1 });

    res.status(200).json(certificates);

  } catch (err) {
    console.error("Error fetching certificates:", err);
    res.status(500).json({ message: "Server error fetching certificates" });
  }
});

module.exports = router;