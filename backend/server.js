// Load variables from the .env file into process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import all route files
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const skillRoutes = require("./routes/skillRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const careerRoutes = require("./routes/careerRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const passportRoutes = require("./routes/passportRoutes");

// Connect to MongoDB Atlas as soon as the server starts
connectDB();

const app = express();

// ---------- MIDDLEWARE ----------
// Allows our React frontend (running on a different port) to talk to this backend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

// Lets Express understand incoming JSON data (e.g. from Axios POST requests)
app.use(express.json({ limit: "100kb" }));

// Makes uploaded resume files accessible via a URL like:
// http://localhost:5000/uploads/filename.pdf
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/passport", passportRoutes);

// Simple route to check if the server is alive
app.get("/", (req, res) => {
  res.json({ message: "SkillSync API is running" });
});

// ---------- ERROR HANDLING ----------
// Catches any error thrown inside route handlers (including Multer errors)
// so the server never crashes and always sends back a clean JSON response.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong on the server",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SkillSync backend server running on http://localhost:${PORT}`);
});
