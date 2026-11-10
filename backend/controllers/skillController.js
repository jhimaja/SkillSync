const User = require("../models/User");

// @route   POST /api/skills
// @desc    Add a new skill to the logged-in student's profile
// @access  Private
const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill || !skill.trim()) {
      return res.status(400).json({ success: false, message: "Skill name is required" });
    }

    const user = await User.findById(req.user.id);

    // Prevent duplicate skills (case-insensitive check)
    const alreadyExists = user.skills.some(
      (s) => s.toLowerCase() === skill.trim().toLowerCase()
    );

    if (alreadyExists) {
      return res.status(400).json({ success: false, message: "Skill already added" });
    }

    user.skills.push(skill.trim());
    await user.save();

    res.status(200).json({
      success: true,
      message: "Skill added successfully",
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/skills/:skillName
// @desc    Remove a skill from the logged-in student's profile
// @access  Private
const removeSkill = async (req, res) => {
  try {
    const { skillName } = req.params;

    const user = await User.findById(req.user.id);

    user.skills = user.skills.filter(
      (s) => s.toLowerCase() !== skillName.toLowerCase()
    );

    // If the student removes a skill, its verification badge goes too.
    user.verifiedSkills = user.verifiedSkills.filter(
      (v) => v.skill.toLowerCase() !== skillName.toLowerCase()
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Skill removed successfully",
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/skills
// @desc    Get all skills of the logged-in student
// @access  Private
const getSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("skills");
    res.status(200).json({ success: true, skills: user.skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addSkill, removeSkill, getSkills };
