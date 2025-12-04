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
const { sendStatusEmail } = require('../utils/emailService'); 

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
      'certinexa_key', 
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
    const orgId = req.params.id;
    
    // 1. Log the body to debug (Check your terminal when you click reject)
    console.log("Incoming Status Update Body:", req.body);

    // 2. Extract Data (Handle both snake_case and camelCase to be safe)
    const { status } = req.body;
    
    // Check for 'rejectionReason' OR 'rejection_reason'
    const reasonPayload = req.body.rejectionReason || req.body.rejection_reason || "";

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // 3. Prepare the update object
    const updateData = { verification_status: status };
    
    if (status === 'rejected') {
        // Ensure we actually have a reason
        if (!reasonPayload) {
             return res.status(400).json({ message: "Rejection reason is required when rejecting." });
        }
        updateData.rejection_reason = reasonPayload;
    } else {
        // CLEVER TRICK: If status is 'approved' or 'pending', CLEAR the rejection reason.
        // This prevents old reasons from staying in the DB if you change your mind.
        updateData.rejection_reason = "";
    }

    // 4. Update in MongoDB
    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // -----------------------
    // ACTION: APPROVED
    // -----------------------
    if (status === "approved") {
      try {
        await generateOrgKeys(orgId);
        await sendStatusEmail(updatedOrg, 'verified'); 
      } catch (keyErr) {
        console.error("Key Generation/Email Error:", keyErr);
        // Note: We don't return 500 here because the DB update was actually successful
      }
    }

    // -----------------------
    // ACTION: REJECTED
    // -----------------------
    if (status === "rejected") {
       try {
         // Pass the reasonPayload explicitly to the email function
         await sendStatusEmail(updatedOrg, 'rejected', reasonPayload);
       } catch (emailErr) {
         console.error("Email Sending Error:", emailErr);
       }
    }
  
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