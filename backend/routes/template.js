const express = require("express");
const router = express.Router();
const Template = require("../models/organization/template");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.organizationId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// POST /api/template/create
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { templateName, fields } = req.body;

    if (!templateName || !Array.isArray(fields) || fields.length === 0) {
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
