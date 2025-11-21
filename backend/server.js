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

// Import organization routes
const organizationRoutes = require("./routes/organization");
const organizationLoginRoutes = require("./routes/organizationlogin"); // new login route

// Use routes
app.use("/api/organization", organizationRoutes);
app.use("/api/organization", organizationLoginRoutes); // mount login route

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));