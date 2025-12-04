const express = require("express");
const router = express.Router();
const Template = require("../models/organization/template");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY"); // replace with process.env.JWT_SECRET
    req.organizationId = decoded.id;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

// POST /api/template/create
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { templateName, fields } = req.body;

    if (!templateName || !fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ message: "Template name and fields are required." });
    }

    const template = new Template({
      organizationId: req.organizationId,
      templateName,
      fields,
    });

    await template.save();
    res.status(201).json({ message: "Template created successfully!", template });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/template/list
router.get("/list", verifyToken, async (req, res) => {
  try {
    const templates = await Template.find({ organizationId: req.organizationId });
    res.status(200).json({ templates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// DELETE /api/template/delete/:id
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const template = await Template.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.organizationId,
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found." });
    }

    res.status(200).json({ message: "Template deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
