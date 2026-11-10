const User = require("../models/User");
const CareerRole = require("../models/CareerRole");
const { buildRoadmap } = require("../utils/roadmap");

// @route   GET /api/roadmap
// @desc    Build the personalised roadmap for the student's target role
const getRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.targetRole) {
      return res.status(200).json({ success: true, target: null });
    }

    const role = await CareerRole.findById(user.targetRole);
    if (!role) {
      return res.status(200).json({ success: true, target: null });
    }

    const { steps, summary } = buildRoadmap({
      role,
      userSkills: user.skills,
      verifiedSkills: user.verifiedSkills,
      weeklyHours: user.weeklyHours,
    });

    res.status(200).json({
      success: true,
      target: {
        id: role._id,
        title: role.title,
        category: role.category,
        description: role.description,
        averageSalaryINR: role.averageSalaryINR,
      },
      summary,
      steps,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/roadmap/target
// @desc    Choose the target role and the weekly study hours
// body:    { roleId, weeklyHours }
const setTarget = async (req, res) => {
  try {
    const { roleId, weeklyHours } = req.body;
    const update = {};

    if (roleId) {
      const role = await CareerRole.findById(roleId).select("_id");
      if (!role) {
        return res.status(404).json({ success: false, message: "Career role not found" });
      }
      update.targetRole = role._id;
    }

    if (weeklyHours !== undefined) {
      const hours = Number(weeklyHours);
      if (!Number.isFinite(hours) || hours < 1 || hours > 60) {
        return res.status(400).json({ success: false, message: "Weekly hours must be between 1 and 60" });
      }
      update.weeklyHours = hours;
    }

    await User.findByIdAndUpdate(req.user.id, update);
    res.status(200).json({ success: true, message: "Roadmap settings saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRoadmap, setTarget };
