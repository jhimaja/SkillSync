/**
 * ROADMAP BUILDER
 * ---------------------------------------------------------------------------
 * Turns a skill gap into an ordered, personalised learning plan.
 *
 *  Input : the student's target role, their claimed + verified skills,
 *          and how many hours per week they can study.
 *  Output: a list of steps (one per skill that is not yet verified), ordered
 *          so that prerequisites come first, plus a summary with the
 *          estimated number of weeks.
 *
 * A step is only "done" when the skill is VERIFIED by a challenge - ticking
 * a box is not enough. That is what makes the roadmap honest.
 *
 * Still plain JavaScript logic - no AI.
 */
const { getSkillInfo, skillCatalog, getCanonicalSkillName } = require("../data/skillCatalog");
const { calculateReadiness, normalize } = require("./matchSkills");

// Hours needed for a skill the student already claims but has not proved yet.
// They only need to revise and take the challenge.
const REVISION_HOURS = 2;

// How "deep" a skill is in the prerequisite chain (0 = no prerequisites).
const getDepth = (skillName, seen = new Set()) => {
  const canonical = getCanonicalSkillName(skillName);
  if (!canonical || seen.has(canonical)) return 0;
  seen.add(canonical);
  const prereqs = skillCatalog[canonical].prerequisites;
  if (prereqs.length === 0) return 0;
  return 1 + Math.max(...prereqs.map((p) => getDepth(p, new Set(seen))));
};

const phaseForDepth = (depth) => (depth === 0 ? "Foundation" : depth === 1 ? "Core" : "Advanced");

const buildRoadmap = ({ role, userSkills, verifiedSkills, weeklyHours }) => {
  const verifiedNames = verifiedSkills.map((v) => v.skill);
  const readiness = calculateReadiness(userSkills, verifiedNames, role.requiredSkills);
  const statusBySkill = {};
  readiness.skillStatuses.forEach((s) => (statusBySkill[normalize(s.skill)] = s.status));

  // Build one step per required skill.
  let steps = role.requiredSkills.map((skillName) => {
    const info = getSkillInfo(skillName);
    const status = statusBySkill[normalize(skillName)];
    const depth = getDepth(skillName);

    // Which prerequisites (that this role also needs) are still unverified?
    const waitingOn = info.prerequisites.filter(
      (p) =>
        role.requiredSkills.some((r) => normalize(r) === normalize(p)) &&
        statusBySkill[normalize(p)] !== "verified"
    );

    return {
      skill: skillName,
      status, // verified | claimed | missing
      phase: phaseForDepth(depth),
      depth,
      estimatedHours: status === "verified" ? 0 : status === "claimed" ? REVISION_HOURS : info.hours,
      action:
        status === "verified"
          ? "Verified - nothing left to do"
          : status === "claimed"
          ? "You say you know this. Revise it, then prove it with the challenge."
          : "Learn it, build the mini project, then pass the challenge.",
      prerequisites: info.prerequisites,
      waitingOn,
      project: info.project,
      resources: info.resources,
      verifiable: info.known, // only catalogued skills have challenges
    };
  });

  // Order: shallow prerequisites first, then bigger skills later.
  steps.sort((a, b) => a.depth - b.depth || a.estimatedHours - b.estimatedHours);
  steps = steps.map((step, i) => ({ ...step, order: i + 1 }));

  const remaining = steps.filter((s) => s.status !== "verified");
  const totalHoursRemaining = remaining.reduce((sum, s) => sum + s.estimatedHours, 0);
  const weeksRemaining = Math.ceil(totalHoursRemaining / Math.max(1, weeklyHours));

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + weeksRemaining * 7);

  const nextStep = remaining.find((s) => s.waitingOn.length === 0) || remaining[0] || null;

  return {
    steps,
    summary: {
      readinessScore: readiness.readinessScore,
      totalSkills: steps.length,
      verifiedCount: readiness.verifiedCount,
      claimedOnlyCount: readiness.claimedOnlyCount,
      missingCount: readiness.missingCount,
      totalHoursRemaining,
      weeklyHours,
      weeksRemaining,
      estimatedReadyBy: weeksRemaining === 0 ? null : targetDate.toISOString(),
      jobReady: steps.length > 0 && remaining.length === 0,
      nextSkill: nextStep ? nextStep.skill : null,
    },
  };
};

module.exports = { buildRoadmap };
