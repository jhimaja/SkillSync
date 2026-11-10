const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getAllCareerRoles,
  getCareerMatches,
  getCareerRoleById,
} = require("../controllers/careerController");

// NOTE: Route order matters in Express!
// "/match" must be declared BEFORE "/:id", otherwise Express would think
// "match" is an :id value and send it to getCareerRoleById by mistake.
router.get("/match", protect, getCareerMatches);
router.get("/", protect, getAllCareerRoles);
router.get("/:id", protect, getCareerRoleById);

module.exports = router;
