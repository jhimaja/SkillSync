const User = require("../models/User");
const { quizBank, codeChallenges } = require("../data/challengeBank");
const { getCanonicalSkillName } = require("../data/skillCatalog");
const { runCodeChallenge } = require("../utils/codeRunner");

const PASS_MARK_PERCENT = 67; // 2 out of 3 questions
const COOLDOWN_SECONDS = 30; // wait time between attempts on the same skill
const codeEnabled = () => process.env.ENABLE_CODE_CHALLENGES !== "false";

// Picks the coding challenge for a skill (if the skill has one and code is enabled).
const pickCodeChallenge = (skill, codeId) => {
  const list = codeChallenges[skill];
  if (!list || !codeEnabled()) return null;
  if (codeId) return list.find((c) => c.id === codeId) || null;
  return list[Math.floor(Math.random() * list.length)];
};

// @route   GET /api/challenges
// @desc    List every skill that has a challenge, with the student's status
const listChallenges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("verifiedSkills");
    const verified = {};
    user.verifiedSkills.forEach((v) => (verified[v.skill.toLowerCase()] = v));

    const challenges = Object.keys(quizBank).map((skill) => ({
      skill,
      hasCode: Boolean(codeChallenges[skill]) && codeEnabled(),
      verified: Boolean(verified[skill.toLowerCase()]),
      bestScore: verified[skill.toLowerCase()]?.score || null,
    }));

    res.status(200).json({ success: true, challenges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/challenges/:skill
// @desc    Get the questions (WITHOUT answers) for one skill
const getChallenge = async (req, res) => {
  try {
    const skill = getCanonicalSkillName(req.params.skill);
    if (!skill || !quizBank[skill]) {
      return res.status(404).json({
        success: false,
        message: `There is no challenge for "${req.params.skill}" yet.`,
      });
    }

    const code = pickCodeChallenge(skill);

    res.status(200).json({
      success: true,
      skill,
      passMarkPercent: PASS_MARK_PERCENT,
      // Only send what the student needs. `answer` and `explanation` stay on the server.
      questions: quizBank[skill].map((item, index) => ({
        id: index,
        text: item.text,
        code: item.code,
        options: item.options,
      })),
      codeChallenge: code
        ? {
            id: code.id,
            title: code.title,
            prompt: code.prompt,
            functionName: code.functionName,
            starterCode: code.starterCode,
            examples: code.tests.slice(0, 2).map((t) => ({
              input: JSON.stringify(t.args).slice(1, -1),
              expected: JSON.stringify(t.expected),
            })),
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/challenges/:skill/submit
// @desc    Grade a challenge attempt and, if passed, mark the skill as VERIFIED
// body:    { answers: { "0": 2, "1": 0, "2": 3 }, code: "...", codeId: "js-fizzbuzz" }
const submitChallenge = async (req, res) => {
  try {
    const skill = getCanonicalSkillName(req.params.skill);
    if (!skill || !quizBank[skill]) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }

    const user = await User.findById(req.user.id);

    // Simple cool-down so answers cannot be brute-forced by spamming retries.
    const lastAttempt = [...user.attempts].reverse().find((a) => a.skill === skill);
    if (lastAttempt) {
      const secondsSince = (Date.now() - new Date(lastAttempt.at).getTime()) / 1000;
      if (secondsSince < COOLDOWN_SECONDS) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${Math.ceil(COOLDOWN_SECONDS - secondsSince)} seconds before trying ${skill} again.`,
        });
      }
    }

    const { answers = {}, code, codeId } = req.body;

    // ----- 1. Grade the practical questions -----
    const questionResults = quizBank[skill].map((item, index) => {
      const chosen = Number(answers[index]);
      const correct = chosen === item.answer;
      return {
        id: index,
        correct,
        // Only explain the ones the student got wrong.
        explanation: correct ? "" : item.explanation,
      };
    });
    const correctCount = questionResults.filter((r) => r.correct).length;
    const quizScore = Math.round((correctCount / quizBank[skill].length) * 100);
    const quizPassed = quizScore >= PASS_MARK_PERCENT;

    // ----- 2. Grade the coding challenge (if this skill has one) -----
    let codeResult = null;
    const codeChallenge = pickCodeChallenge(skill, codeId);
    if (codeChallenge) {
      codeResult = runCodeChallenge(code, codeChallenge);
    }
    const codeScore = codeResult ? Math.round((codeResult.passedCount / codeResult.total) * 100) : null;

    // ----- 3. Final result -----
    const passed = quizPassed && (!codeResult || codeResult.passed);
    const score = codeResult ? Math.round((quizScore + codeScore) / 2) : quizScore;

    user.attempts.push({ skill, score, quizScore, codeScore, passed, at: new Date() });
    if (user.attempts.length > 100) user.attempts = user.attempts.slice(-100);

    if (passed) {
      // Keep the BEST score if the skill was already verified.
      const existing = user.verifiedSkills.find((v) => v.skill.toLowerCase() === skill.toLowerCase());
      if (existing) {
        existing.score = Math.max(existing.score, score);
        existing.verifiedAt = new Date();
      } else {
        user.verifiedSkills.push({ skill, score, verifiedAt: new Date() });
      }

      // A verified skill is automatically part of the profile too.
      const onProfile = user.skills.some((s) => s.toLowerCase() === skill.toLowerCase());
      if (!onProfile) user.skills.push(skill);
    }

    await user.save();

    res.status(200).json({
      success: true,
      passed,
      score,
      quizScore,
      codeScore,
      passMarkPercent: PASS_MARK_PERCENT,
      questionResults,
      codeResult,
      message: passed
        ? `${skill} is now verified on your profile!`
        : `Not verified yet. You need ${PASS_MARK_PERCENT}% on the questions${codeResult ? " and every coding test passing" : ""}. Review and try again.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { listChallenges, getChallenge, submitChallenge };
