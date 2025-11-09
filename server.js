const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());


app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "mellow-cupcake-2c1885.netlify.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));



app.get("/", (req, res) => {
  res.send("✅ PetalGlow Backend is running");
});

// ✅ Connect to MongoDB safely
const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/petalglow";

mongoose.connect(MONGO)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Database Error:", err));

// ✅ Load User model
const User = require("./models/User");

// ✅ SIGNUP
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: "User Registered" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ✅ LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, message: "Login successful", user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ✅ PORT for Render or Local
const PORT = process.env.PORT || 5002;

// Print a clickable HTTP link in most terminals (e.g. http://localhost:5002)
const localUrl = `http://localhost:${PORT}`;
app.listen(PORT, () => console.log(`✅ Server running at ${localUrl}`));
