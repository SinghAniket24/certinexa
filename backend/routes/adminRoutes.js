const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// IMPORT MODELS
// ==========================================
const Admin = require('../models/admin/admin'); 
const Organization = require('../models/organization/organization');

// ==========================================
// IMPORT DIGITAL SIGNATURE KEY GENERATOR
// ==========================================
const generateOrgKeys = require('../digitalSignature/keyGenerator');

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// @route   POST /api/admin/register
// @desc    Register a new admin
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, walletAddress, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      walletAddress,
      role
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// @route   POST /api/admin/login
// @desc    Login admin and return JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      'certinexa_key', // You can move this to process.env.JWT_SECRET for better security
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        walletAddress: admin.walletAddress
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ==========================================
// DASHBOARD / ORGANIZATION ROUTES
// ==========================================

// @route   GET /api/admin/organizations
// @desc    Get all organizations for the dashboard
router.get('/organizations', async (req, res) => {
  try {
    const organizations = await Organization.find().sort({ createdAt: -1 });
    res.status(200).json(organizations);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Error fetching organizations" });
  }
});

// @route   PUT /api/admin/organization/:id/status
// @desc    Update organization verification_status (Approve/Reject)
router.put('/organization/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // Expecting 'approved' or 'rejected'
    const orgId = req.params.id;

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update verification_status in MongoDB
    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      { verification_status: status },
      { new: true }
    );

    if (!updatedOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // -----------------------
    // KEY GENERATION ON APPROVAL
    // -----------------------
    if (status === "approved") {
      try {
        // Generate public/private key pair and store securely
        await generateOrgKeys(orgId);


        // TODO: SEND APPROVAL EMAIL

      } catch (keyErr) {
        console.error("Key Generation Error:", keyErr);
        return res.status(500).json({ message: "Organization approved, but key generation failed." });
      }
    }

    // -----------------------
    // TODO: SEND REJECTION EMAIL
  
    res.status(200).json({
      message: `Organization ${status} successfully`,
      org: updatedOrg
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Error updating status" });
  }
});

module.exports = router;
