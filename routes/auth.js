
// server.js (or routes/auth.js) — login handler
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // make sure bcryptjs is installed

const app = express();
app.use(express.json());
app.use(cors());

// --- example minimal user schema (only if you don't have a separate models/User.js)
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String // hashed password
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

// LOGIN route that accepts username OR email

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // ✅ Login success
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


