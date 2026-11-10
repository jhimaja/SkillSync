const mongoose = require("mongoose");

// Each CareerRole document represents one job role (e.g. "Frontend Developer")
// along with the list of skills that are usually required for that role.
// We compare a student's skills against this list using plain JavaScript logic
// (see utils/matchSkills.js) - no AI is involved.
const careerRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "General",
    },
    requiredSkills: {
      type: [String],
      required: true,
      default: [],
    },
    averageSalaryINR: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerRole", careerRoleSchema);
