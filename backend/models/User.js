const mongoose = require("mongoose");

// A "Schema" defines the shape of the documents (records) stored in MongoDB.
// Think of it like defining the columns of a table in a normal SQL database.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    college: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      default: "",
    },
    graduationYear: {
      type: Number,
      default: null,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    // An array of skill names the student has added to their profile, e.g.
    // ["JavaScript", "React", "MongoDB"]
    skills: {
      type: [String],
      default: [],
    },
    // Information about the uploaded resume file (stored by Multer on disk).
    resume: {
      fileName: { type: String, default: "" },
      filePath: { type: String, default: "" },
      uploadedAt: { type: Date, default: null },
    },

    // ---------- NEW: ROADMAP + VERIFICATION FEATURES ----------

    // The career role the student is aiming for. The roadmap is built for it.
    targetRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerRole",
      default: null,
    },

    // How many hours per week the student can study. Used to estimate
    // how many weeks the roadmap will take.
    weeklyHours: {
      type: Number,
      default: 8,
      min: 1,
      max: 60,
    },

    // Skills that were PROVED by passing a practical challenge.
    // This is different from "skills", which only holds what the student CLAIMS.
    verifiedSkills: [
      {
        skill: { type: String, required: true },
        score: { type: Number, default: 0 }, // best score (0-100)
        verifiedAt: { type: Date, default: Date.now },
      },
    ],

    // History of every challenge attempt (we keep only the latest 100).
    attempts: [
      {
        skill: String,
        score: Number,
        quizScore: Number,
        codeScore: { type: Number, default: null },
        passed: Boolean,
        at: { type: Date, default: Date.now },
      },
    ],

    // If true, anyone with the link can view the student's Skill Passport.
    passportPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields to every user document.
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
