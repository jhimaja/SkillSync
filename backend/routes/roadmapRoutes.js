const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getRoadmap, setTarget } = require("../controllers/roadmapController");

router.get("/", protect, getRoadmap);
router.put("/target", protect, setTarget);

module.exports = router;
