const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getPassport, setVisibility } = require("../controllers/passportController");

// "/visibility" must come BEFORE "/:userId" (same Express rule as in careerRoutes).
router.put("/visibility", protect, setVisibility);
// Public route: no "protect" - the controller checks privacy itself.
router.get("/:userId", getPassport);

module.exports = router;
