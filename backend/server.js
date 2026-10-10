const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many requests, please try again later." }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests, please try again later." }
});

// Organization Routes
const organizationRoutes = require("./routes/organization");
const organizationLoginRoutes = require("./routes/organizationlogin");

// Recipient Routes
const recepientRoutes = require("./routes/recepient");

// Admin Routes
const adminRoutes = require('./routes/adminRoutes');

// Template Routes
const templateRoutes = require("./routes/template");

// Use Organization Routes
app.use("/api/organization/login", loginLimiter);
app.use("/api/organization", organizationRoutes);
app.use("/api/organization", organizationLoginRoutes);

// Use Recipient Routes
app.use("/api/recepient/login", loginLimiter);
app.use("/api/recepient", recepientRoutes);

// Use Admin Routes
app.use('/api/admin/login', loginLimiter);
app.use('/api/admin', adminRoutes);

// Use Template Routes
app.use("/api/template", templateRoutes);

//certificate routes
const certificateRoutes = require("./routes/certificate");
app.use("/certificate", certificateRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

//bulk certificate
app.use("/certificate", require("./routes/bulkCertificate"));

const verifierRoute = require("./routes/verifier");
app.use("/verify", verifierRoute);

//chatbot 
const chatbotRoutes = require("./routes/chatbot");
app.use("/api/chatbot", chatbotLimiter, chatbotRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


