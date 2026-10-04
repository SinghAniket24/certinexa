const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Load backend/.env if it exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// 3. Import the existing Admin model
const Admin = require('../models/admin/admin');

// 4. Read 4 command-line arguments
const args = process.argv.slice(2);
if (args.length < 4) {
  console.error("Usage: node createAdmin.js <username> <email> <password> <walletAddress>");
  process.exit(1);
}

const [username, email, password, walletAddress] = args;

const run = async () => {
  try {
    // 2. Connect to MongoDB matching backend/config/db.js
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // 5. Hash the password with bcryptjs (10 salt rounds matching adminRoutes.js)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Create and save new Admin document
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      walletAddress,
      role: "SuperAdmin"
    });

    await newAdmin.save();
    
    // 7. Print success message
    console.log(`Admin created: ${email}`);
  } catch (error) {
    // 7. Print error message on failure
    console.error(`Error: ${error.message}`);
  } finally {
    // 8. Close mongoose connection and exit(0) either way
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(0);
  }
};

run();
