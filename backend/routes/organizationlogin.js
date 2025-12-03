const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");   // added
const Organization = require("../models/organization/organization");

// POST /api/organization/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if organization exists
    const org = await Organization.findOne({ officialEmail: email });
    if (!org) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check verification status
    if (org.verification_status === "pending") {
      return res.status(403).json({ message: "Your account is under review." });
    } 
    if (org.verification_status === "rejected") {
      return res.status(403).json({ message: "Your account was rejected." });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: org._id, email: org.officialEmail },
      "SECRET_KEY",          // replace with process.env.JWT_SECRET later
      { expiresIn: "7d" }
    );

    // Success
// Success
res.status(200).json({
  message: "Login successful!",
  token,
  organization: {
    id: org._id,
    name: org.organizationName,
    email: org.officialEmail,
    status: org.verification_status,
    contactNumber: org.officialPhone,
    organizationAddress: org.organizationAddress,
    createdAt: org.createdAt
  }
});


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

module.exports = router;
