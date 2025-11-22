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

// Use Organization Routes
app.use("/api/organization", organizationRoutes);
app.use("/api/organization", organizationLoginRoutes);

// Use Recipient Routes
app.use("/api/recepient", recepientRoutes);
app.use("/api/recepient", recepientLoginRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
