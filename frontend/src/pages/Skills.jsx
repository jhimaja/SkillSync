import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const SUGGESTED_SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "MongoDB",
  "Python",
  "SQL",
  "HTML",
  "CSS",
  "Git",
  "Java",
];

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [verified, setVerified] = useState({}); // { "react": 85 }
  const [challengeSkills, setChallengeSkills] = useState([]); // skills that have a challenge
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [skillsRes, profileRes, challengesRes] = await Promise.all([
        api.get("/skills"),
        api.get("/profile"),
        api.get("/challenges"),
      ]);
      setSkills(skillsRes.data.skills);

      const verifiedMap = {};
      (profileRes.data.user.verifiedSkills || []).forEach((v) => {
        verifiedMap[v.skill.toLowerCase()] = v.score;
      });
      setVerified(verifiedMap);
      setChallengeSkills(challengesRes.data.challenges.map((c) => c.skill.toLowerCase()));
    } catch (err) {
      console.error("Failed to load skills", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSkill = async (skillToAdd) => {
    const skillValue = (skillToAdd || newSkill).trim();
    if (!skillValue) return;

    setError("");
    try {
      const res = await api.post("/skills", { skill: skillValue });
      setSkills(res.data.skills);
      setNewSkill("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add skill");
    }
  };

  const handleRemoveSkill = async (skill) => {
    try {
      const res = await api.delete(`/skills/${encodeURIComponent(skill)}`);
      setSkills(res.data.skills);
      // Removing a skill also removes its verified badge on the server.
      const next = { ...verified };
      delete next[skill.toLowerCase()];
      setVerified(next);
    } catch (err) {
      console.error("Failed to remove skill", err);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAddSkill();
  };

  if (loading) {
    return <div className="page-loading">Loading your skills...</div>;
  }

  const verifiedCount = skills.filter((s) => verified[s.toLowerCase()] !== undefined).length;

  return (
    <div className="form-page">
      <h1>My Skills</h1>
      <p className="page-subtitle">
        Add the skills you know, then prove them. Verified skills count fully toward your job readiness.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="skill-input-row" onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="e.g. React, MongoDB, Python..."
        />
        <button type="submit" className="btn btn-primary">
          Add Skill
        </button>
      </form>

      <div className="skills-tags-wrapper">
        <h3>
          Your Skills ({skills.length}), {verifiedCount} verified
        </h3>
        {skills.length === 0 ? (
          <p className="empty-state">No skills added yet. Start adding some above!</p>
        ) : (
          <ul className="skill-rows">
            {skills.map((skill) => {
              const score = verified[skill.toLowerCase()];
              const canVerify = challengeSkills.includes(skill.toLowerCase());
              return (
                <li key={skill} className="skill-row">
                  <span className="skill-row-name">{skill}</span>
                  {score !== undefined ? (
                    <span className="status-pill status-verified">Verified {score}%</span>
                  ) : (
                    <span className="status-pill status-claimed">Not proved yet</span>
                  )}
                  <span className="skill-row-actions">
                    {canVerify && (
                      <Link to={`/challenge/${encodeURIComponent(skill)}`} className="btn btn-outline btn-sm">
                        {score !== undefined ? "Retake" : "Verify"}
                      </Link>
                    )}
                    <button
                      className="tag-remove-btn"
                      onClick={() => handleRemoveSkill(skill)}
                      title={`Remove ${skill}`}
                      aria-label={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="skills-tags-wrapper">
        <h3>Suggested Skills</h3>
        <div className="tags-list">
          {SUGGESTED_SKILLS.filter(
            (s) => !skills.some((existing) => existing.toLowerCase() === s.toLowerCase())
          ).map((skill) => (
            <button
              key={skill}
              className="skill-tag skill-tag-suggested"
              onClick={() => handleAddSkill(skill)}
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
