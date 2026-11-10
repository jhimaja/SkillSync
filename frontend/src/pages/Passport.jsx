import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// The Skill Passport: a one-page summary of skills the student has PROVED.
// If the student turns sharing on, anyone with the link can open it - no login.
// Route /passport (no id) shows your own passport; /passport/:id shows a shared one.
const Passport = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const userId = id || user?.id;

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/passport/${userId}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this passport");
      } finally {
        setLoading(false);
      }
    };
    if (userId) load();
    else setLoading(false);
  }, [userId]);

  const toggleSharing = async () => {
    const res = await api.put("/passport/visibility", { isPublic: !data.isPublic });
    setData({ ...data, isPublic: res.data.isPublic });
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/passport/${userId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="page-loading">Loading passport...</div>;
  if (error || !data) {
    return (
      <div className="form-page">
        <h1>Skill Passport</h1>
        <div className="alert alert-error">{error || "Passport not found"}</div>
        <Link to="/" className="btn btn-outline">
          Go home
        </Link>
      </div>
    );
  }

  const { passport, isOwner } = data;

  return (
    <div className="passport-page">
      {isOwner && (
        <div className="passport-owner-bar">
          <div>
            <strong>Sharing is {data.isPublic ? "on" : "off"}.</strong>{" "}
            {data.isPublic
              ? "Anyone with your link can see this page."
              : "Only you can see this page. Turn sharing on to send it to recruiters."}
          </div>
          <div className="passport-owner-actions">
            <button className="btn btn-outline btn-sm" onClick={toggleSharing}>
              {data.isPublic ? "Turn sharing off" : "Turn sharing on"}
            </button>
            {data.isPublic && (
              <button className="btn btn-primary btn-sm" onClick={copyLink}>
                {copied ? "Link copied" : "Copy link"}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="passport-card">
        <p className="passport-kicker">SkillSync Skill Passport</p>
        <h1>{passport.name}</h1>
        <p className="passport-meta">
          {[passport.college, passport.branch, passport.graduationYear && `Class of ${passport.graduationYear}`]
            .filter(Boolean)
            .join(", ") || "Student"}
        </p>

        {passport.target && (
          <div className="passport-target">
            <span className="passport-readiness">{passport.target.readinessScore}%</span>
            <span>ready for {passport.target.title}</span>
          </div>
        )}

        <h2>Verified skills ({passport.verifiedSkills.length})</h2>
        {passport.verifiedSkills.length === 0 ? (
          <p className="empty-state">No skills verified yet. Each one is earned by passing a practical challenge.</p>
        ) : (
          <ul className="passport-skills">
            {passport.verifiedSkills.map((v) => (
              <li key={v.skill}>
                <span className="passport-skill-name">{v.skill}</span>
                <span className="passport-skill-score">{v.score}%</span>
                <span className="passport-skill-date">{new Date(v.verifiedAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}

        {passport.target && (
          <>
            <h2>Skills for {passport.target.title}</h2>
            <div className="tags-list">
              {passport.target.skillStatuses.map((s) => (
                <span key={s.skill} className={`skill-tag skill-tag-${s.status}`}>
                  {s.skill}
                </span>
              ))}
            </div>
            <p className="passport-legend">Green: verified by challenge. Amber: claimed only. Red: not yet.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Passport;
