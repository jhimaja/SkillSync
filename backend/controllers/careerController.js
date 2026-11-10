const User = require("../models/User");
const CareerRole = require("../models/CareerRole");
const { findBestCareerMatches, calculateMatch, calculateReadiness } = require("../utils/matchSkills");

// @route   GET /api/careers
// @desc    Get the full list of predefined career roles
// @access  Private
const getAllCareerRoles = async (req, res) => {
  try {
    const roles = await CareerRole.find().sort({ title: 1 });
    res.status(200).json({ success: true, roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/careers/match
// @desc    Compare the logged-in student's skills against ALL career roles
//          and return them ranked from best match to worst match.
//          This is where the "skill matching logic" (plain JavaScript, no AI)
//          actually runs.
// @access  Private
const getCareerMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const roles = await CareerRole.find();

    if (!user.skills || user.skills.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Add some skills to your profile to see career matches",
        matches: [],
      });
    }

    // Pass the VERIFIED skills too, so each role gets a Job Readiness score.
    const verifiedNames = user.verifiedSkills.map((v) => v.skill);
    const matches = findBestCareerMatches(user.skills, roles, verifiedNames);

    res.status(200).json({ success: true, matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/careers/:id
// @desc    Get details of ONE career role plus how well the student matches it
// @access  Private
const getCareerRoleById = async (req, res) => {
  try {
    const role = await CareerRole.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Career role not found" });
    }

    const user = await User.findById(req.user.id);
    const match = {
      ...calculateMatch(user.skills, role.requiredSkills),
      ...calculateReadiness(
        user.skills,
        user.verifiedSkills.map((v) => v.skill),
        role.requiredSkills
      ),
    };

    res.status(200).json({ success: true, role, match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllCareerRoles, getCareerMatches, getCareerRoleById };
