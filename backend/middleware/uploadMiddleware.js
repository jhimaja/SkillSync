const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Make sure the uploads folder exists (Multer will not create it automatically).
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer needs to know WHERE to store files and WHAT to name them.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Example result: 64f1c2b1-resume-1699999999999.pdf
    // Using the logged-in user's id + timestamp keeps file names unique.
    const uniqueSuffix = Date.now();
    const safeOriginalName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${req.user.id}-${uniqueSuffix}-${safeOriginalName}`);
  },
});

// Only allow PDF and Word documents for resumes.
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or Word documents are allowed for resumes"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload;
