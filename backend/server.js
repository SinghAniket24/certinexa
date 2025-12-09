const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Organization Routes
const organizationRoutes = require("./routes/organization");
const organizationLoginRoutes = require("./routes/organizationlogin");

// Recipient Routes
const recepientRoutes = require("./routes/recepient");
const recepientLoginRoutes = require("./routes/recepientlogin");

// Admin Routes
const adminRoutes = require('./routes/adminRoutes');

// Template Routes
const templateRoutes = require("./routes/template");

// Use Organization Routes
app.use("/api/organization", organizationRoutes);
app.use("/api/organization", organizationLoginRoutes);

// Use Recipient Routes
app.use("/api/recepient", recepientRoutes);
app.use("/api/recepient", recepientLoginRoutes);

// Use Admin Routes
app.use('/api/admin', adminRoutes);

// Use Template Routes
app.use("/api/template", templateRoutes);

//certificate routes
const certificateRoutes = require("./routes/certificate");
app.use("/certificate", certificateRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const verifierRoute = require("./routes/verifier");
app.use("/verify", verifierRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

