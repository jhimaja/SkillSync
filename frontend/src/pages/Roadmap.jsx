import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const PHASES = ["Foundation", "Core", "Advanced"];

const STATUS_LABEL = {
  verified: "Verified",
  claimed: "Claimed, not proved",
  missing: "To learn",
};

// The Roadmap page: pick a target role, then see a personalised, ordered
// learning plan. A step only turns green when the skill is VERIFIED.
const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadRoadmap = async () => {
    try {
      const [roadmapRes, rolesRes] = await Promise.all([api.get("/roadmap"), api.get("/careers")]);
      setRoadmap(roadmapRes.data);
      setRoles(rolesRes.data.roles || []);
      if (roadmapRes.data.target) {
        setRoleId(roadmapRes.data.target.id);
        setWeeklyHours(roadmapRes.data.summary.weeklyHours);
      }
    } catch (err) {
      setError("Could not load your roadmap. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!roleId) {
      setError("Choose a target role first.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.put("/roadmap/target", { roleId, weeklyHours: Number(weeklyHours) });
      setEditing(false);
      await loadRoadmap();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loading">Building your roadmap...</div>;

  const target = roadmap?.target;
  const showForm = !target || editing;

  const settingsForm = (
    <form className="card-form roadmap-form" onSubmit={handleSave}>
      <div className="form-group">
        <label htmlFor="role">Which job do you want?</label>
        <select id="role" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
          <option value="">Choose a role</option>
          {roles.map((r) => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="hours">Hours you can study per week</label>
        <input
          id="hours"
          type="number"
          min="1"
          max="60"
          value={weeklyHours}
          onChange={(e) => setWeeklyHours(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" disabled={saving}>
        {saving ? "Saving..." : "Build my roadmap"}
      </button>
      {target && (
        <button type="button" className="btn btn-outline roadmap-cancel" onClick={() => setEditing(false)}>
          Cancel
        </button>
      )}
    </form>
  );

  if (!target) {
    return (
      <div className="form-page">
        <h1>Your learning roadmap</h1>
        <p className="page-subtitle">
          Pick the job you are aiming for. SkillSync finds the gaps between your skills and that job, then
          orders what to learn, and you prove each skill with a practical challenge.
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        {settingsForm}
      </div>
    );
  }

  const { summary, steps } = roadmap;
  const readyBy = summary.estimatedReadyBy
    ? new Date(summary.estimatedReadyBy).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div className="roadmap-page">
      <div className="roadmap-heading">
        <div>
          <h1>Road to {target.title}</h1>
          <p className="page-subtitle">{target.description}</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => setEditing(!editing)}>
          {editing ? "Close" : "Change target"}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {editing && settingsForm}

      {summary.jobReady && (
        <div className="alert alert-success">
          Every skill for this role is verified. Share your{" "}
          <Link to="/passport">Skill Passport</Link> with recruiters.
        </div>
      )}

      <div className="stats-grid stats-grid-4">
        <div className="stat-card">
          <span className="stat-number">{summary.readinessScore}%</span>
          <span className="stat-label">Job readiness</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {summary.verifiedCount}/{summary.totalSkills}
          </span>
          <span className="stat-label">Skills verified</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{summary.totalHoursRemaining}h</span>
          <span className="stat-label">Study time left</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{summary.weeksRemaining} wk</span>
          <span className="stat-label">{readyBy ? `At ${summary.weeklyHours} h/week, ready by ${readyBy}` : "You are there"}</span>
        </div>
      </div>

      {PHASES.map((phase) => {
        const phaseSteps = steps.filter((s) => s.phase === phase);
        if (phaseSteps.length === 0) return null;
        return (
          <section key={phase} className="roadmap-phase">
            <h2>{phase}</h2>
            <ol className="roadmap-steps">
              {phaseSteps.map((step) => (
                <li key={step.skill} className={`roadmap-step step-${step.status}`}>
                  <div className="roadmap-step-top">
                    <div>
                      <h3>{step.skill}</h3>
                      <span className={`status-pill status-${step.status}`}>{STATUS_LABEL[step.status]}</span>
                      {step.estimatedHours > 0 && <span className="step-hours">about {step.estimatedHours} h</span>}
                    </div>
                    {step.status !== "verified" && step.verifiable && (
                      <Link to={`/challenge/${encodeURIComponent(step.skill)}`} className="btn btn-primary btn-sm">
                        Take the challenge
                      </Link>
                    )}
                    {step.status === "verified" && (
                      <Link to={`/challenge/${encodeURIComponent(step.skill)}`} className="btn-link">
                        Retake
                      </Link>
                    )}
                  </div>

                  {step.status !== "verified" && (
                    <>
                      <p className="step-action">{step.action}</p>
                      {step.waitingOn.length > 0 && (
                        <p className="step-note">Easier after: {step.waitingOn.join(", ")}</p>
                      )}
                      <p className="step-project">
                        <strong>Practice project:</strong> {step.project}
                      </p>
                      <div className="step-resources">
                        {step.resources.map((r) => (
                          <a key={r.url} href={r.url} target="_blank" rel="noreferrer">
                            {r.title}
                            <span className="resource-type">{r.type}</span>
                          </a>
                        ))}
                      </div>
                      {!step.verifiable && (
                        <p className="step-note">No challenge exists for this skill yet.</p>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
};

export default Roadmap;
