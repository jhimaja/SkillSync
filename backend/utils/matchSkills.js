/**
 * This file contains the "brain" of the career matching feature.
 *
 * IMPORTANT: This is NOT artificial intelligence. It is simple, predictable
 * JavaScript logic:
 *   1. We take the skills the student entered.
 *   2. We take the skills required for a career role (from the database).
 *   3. We compare the two arrays and count how many required skills the
 *      student already has.
 *   4. We turn that into a percentage match score.
 *
 * Because it's plain logic (not a trained model), the result is always
 * exactly explainable: "You matched 6 out of 8 required skills."
 *
 * NEW: besides the "claimed" match percentage, we now also calculate a
 * JOB READINESS score that only gives full credit for skills the student has
 * PROVED by passing a practical challenge (see calculateReadiness below).
 */

// Normalizes a skill string so comparisons are not affected by
// capitalization or extra spaces. e.g. " React " and "react" become "react"
const normalize = (skill) => skill.trim().toLowerCase();

/**
 * Compares a user's skills against a single career role's required skills.
 * @param {string[]} userSkills - skills the student added to their profile
 * @param {string[]} requiredSkills - skills required for the career role
 * @returns {object} match details including percentage and skill gaps
 */
const calculateMatch = (userSkills, requiredSkills) => {
  const normalizedUserSkills = userSkills.map(normalize);
  const normalizedRequired = requiredSkills.map(normalize);

  const matchedSkills = requiredSkills.filter((skill) =>
    normalizedUserSkills.includes(normalize(skill))
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !normalizedUserSkills.includes(normalize(skill))
  );

  const matchPercentage =
    requiredSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    matchedSkills,
    missingSkills,
    matchPercentage,
    totalRequired: requiredSkills.length,
    totalMatched: matchedSkills.length,
  };
};

// How much each kind of skill is worth in the Job Readiness score.
//   verified = proved with a challenge  -> full credit
//   claimed  = student says they know it -> partial credit
//   missing  = not on the profile        -> no credit
const READINESS_WEIGHTS = { verified: 1, claimed: 0.4, missing: 0 };

/**
 * Classifies every required skill as verified / claimed / missing and
 * calculates the Job Readiness score (0-100).
 * @param {string[]} userSkills - skills the student CLAIMS
 * @param {string[]} verifiedSkillNames - skills the student has PROVED
 * @param {string[]} requiredSkills - skills the role needs
 */
const calculateReadiness = (userSkills, verifiedSkillNames, requiredSkills) => {
  const claimed = userSkills.map(normalize);
  const verified = (verifiedSkillNames || []).map(normalize);

  const skillStatuses = requiredSkills.map((skill) => {
    const key = normalize(skill);
    let status = "missing";
    if (verified.includes(key)) status = "verified";
    else if (claimed.includes(key)) status = "claimed";
    return { skill, status };
  });

  const points = skillStatuses.reduce((sum, s) => sum + READINESS_WEIGHTS[s.status], 0);
  const readinessScore =
    requiredSkills.length === 0 ? 0 : Math.round((points / requiredSkills.length) * 100);

  return {
    skillStatuses,
    readinessScore,
    verifiedCount: skillStatuses.filter((s) => s.status === "verified").length,
    claimedOnlyCount: skillStatuses.filter((s) => s.status === "claimed").length,
    missingCount: skillStatuses.filter((s) => s.status === "missing").length,
  };
};

/**
 * Compares a user's skills against MANY career roles at once and returns
 * them sorted from best match to worst match.
 * @param {string[]} userSkills
 * @param {Array} careerRoles - array of CareerRole documents from MongoDB
 */
const findBestCareerMatches = (userSkills, careerRoles, verifiedSkillNames = []) => {
  const results = careerRoles.map((role) => {
    const match = calculateMatch(userSkills, role.requiredSkills);
    const readiness = calculateReadiness(userSkills, verifiedSkillNames, role.requiredSkills);
    return {
      roleId: role._id,
      title: role.title,
      description: role.description,
      category: role.category,
      averageSalaryINR: role.averageSalaryINR,
      requiredSkills: role.requiredSkills,
      ...match,
      ...readiness,
    };
  });

  // Sort so the role with the highest READINESS (verified skills count most)
  // appears first; ties are broken by the claimed match percentage.
  results.sort(
    (a, b) => b.readinessScore - a.readinessScore || b.matchPercentage - a.matchPercentage
  );

  return results;
};

module.exports = { calculateMatch, calculateReadiness, findBestCareerMatches, normalize };
