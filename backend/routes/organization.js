const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Organization = require("../models/organization/organization");

router.post("/register", async (req, res) => {
  try {
    const {
      organizationName,
      registrationNumber,
      organizationType,
      customType,
      officialEmail,
      officialPhone,
      walletAddress,
      verificationDocument,
      organizationAddress,
      password,
      confirmPassword
    } = req.body;

    if (
      !organizationName ||
      !organizationType ||
      !officialEmail ||
      !officialPhone ||
      !verificationDocument ||
      !organizationAddress ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingOrg = await Organization.findOne({ officialEmail });
    if (existingOrg) {
      return res.status(400).json({ message: "Organization with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOrg = new Organization({
      organizationName,
      registrationNumber,
      organizationType,
      customType,
      officialEmail,
      officialPhone,
      walletAddress,
      verificationDocument,
      organizationAddress,
      password: hashedPassword,
    });

    await newOrg.save();

    res.status(201).json({ message: "Organization registered successfully.", organization: newOrg });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
