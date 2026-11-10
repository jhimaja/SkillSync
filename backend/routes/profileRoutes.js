const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/profileController");

// Every route below uses "protect" middleware, meaning the user MUST send a
// valid JWT token, or the request is rejected before it reaches the controller.

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);

module.exports = router;
