const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { listChallenges, getChallenge, submitChallenge } = require("../controllers/challengeController");

router.get("/", protect, listChallenges);
router.get("/:skill", protect, getChallenge);
router.post("/:skill/submit", protect, submitChallenge);

module.exports = router;
