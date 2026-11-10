const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const CareerRole = require("../models/CareerRole");
const { calculateReadiness } = require("../utils/matchSkills");

// Reads the token IF one was sent, but does not reject the request when it is
// missing. (The passport page can be public, so visitors have no token.)
const getOptionalUserId = (req) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) return null;
    return jwt.verify(header.split(" ")[1], process.env.JWT_SECRET).id;
  } catch {
    return null;
  }
};

// @route   GET /api/passport/:userId
// @desc    The Skill Passport: a verified-skills summary a recruiter can read.
// @access  Public IF the student turned sharing on, otherwise owner only.
const getPassport = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(404).json({ success: false, message: "Passport not found" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Passport not found" });
    }

    const isOwner = getOptionalUserId(req) === String(user._id);
    if (!user.passportPublic && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "This Skill Passport is private.",
      });
    }

    let target = null;
    if (user.targetRole) {
      const role = await CareerRole.findById(user.targetRole);
      if (role) {
        const readiness = calculateReadiness(
          user.skills,
          user.verifiedSkills.map((v) => v.skill),
          role.requiredSkills
        );
        target = {
          title: role.title,
          readinessScore: readiness.readinessScore,
          skillStatuses: readiness.skillStatuses,
        };
      }
    }

    res.status(200).json({
      success: true,
      isOwner,
      isPublic: user.passportPublic,
      passport: {
        name: user.name,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        verifiedSkills: [...user.verifiedSkills]
          .sort((a, b) => b.score - a.score)
          .map((v) => ({ skill: v.skill, score: v.score, verifiedAt: v.verifiedAt })),
        target,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/passport/visibility
// @desc    Turn public sharing of the Skill Passport on or off
const setVisibility = async (req, res) => {
  try {
    const isPublic = Boolean(req.body.isPublic);
    await User.findByIdAndUpdate(req.user.id, { passportPublic: isPublic });
    res.status(200).json({ success: true, isPublic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPassport, setVisibility };
