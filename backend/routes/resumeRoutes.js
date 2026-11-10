const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadResume, downloadResume } = require("../controllers/resumeController");

// "upload.single('resume')" tells Multer to expect ONE file, sent under the
// form field name "resume", before running the uploadResume controller.
router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/download", protect, downloadResume);

module.exports = router;
