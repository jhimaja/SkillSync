const User = require("../models/User");

// @route   GET /api/profile
// @desc    Get the logged-in student's full profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    // req.user.id was attached by the authMiddleware after verifying the JWT.
    // .select("-password") means "give me everything except the password field".
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/profile
// @desc    Update basic profile details (name, college, branch, bio, etc.)
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, college, branch, graduationYear, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name !== undefined && { name }),
        ...(college !== undefined && { college }),
        ...(branch !== undefined && { branch }),
        ...(graduationYear !== undefined && { graduationYear }),
        ...(bio !== undefined && { bio }),
      },
      { new: true, runValidators: true } // return the UPDATED document
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
