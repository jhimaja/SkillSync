const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { addSkill, removeSkill, getSkills } = require("../controllers/skillController");

router.get("/", protect, getSkills);
router.post("/", protect, addSkill);
router.delete("/:skillName", protect, removeSkill);

module.exports = router;
