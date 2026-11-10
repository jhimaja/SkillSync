const fs = require("fs");
const path = require("path");
const User = require("../models/User");

// @route   POST /api/resume/upload
// @desc    Upload (or replace) the logged-in student's resume file
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);

    // If the student already had a resume uploaded before, delete the old
    // file from the server so we don't waste disk space.
    if (user.resume && user.resume.filePath) {
      const oldPath = path.join(__dirname, "..", user.resume.filePath);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.resume = {
      fileName: req.file.originalname,
      filePath: `uploads/${req.file.filename}`,
      uploadedAt: new Date(),
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/resume/download
// @desc    Download the logged-in student's resume
// @access  Private
const downloadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.resume || !user.resume.filePath) {
      return res.status(404).json({ success: false, message: "No resume uploaded yet" });
    }

    const filePath = path.join(__dirname, "..", user.resume.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Resume file not found on server" });
    }

    res.download(filePath, user.resume.fileName);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadResume, downloadResume };
