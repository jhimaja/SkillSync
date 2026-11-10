import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const STATUS_CLASS = {
  verified: "skill-tag-verified",
  claimed: "skill-tag-claimed",
  missing: "skill-tag-missing",
};

const Careers = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get("/careers/match");
        setMatches(res.data.matches || []);
      } catch (error) {
        console.error("Failed to load career matches", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const toggleExpand = (roleId) => {
    setExpandedId(expandedId === roleId ? null : roleId);
  };

  // Saves this role as the student's target, then opens the roadmap.
  const handleSetTarget = async (e, roleId) => {
    e.stopPropagation(); // don't also toggle the card
    try {
      await api.put("/roadmap/target", { roleId });
      navigate("/roadmap");
    } catch (error) {
      console.error("Could not set target role", error);
    }
  };

  if (loading) {
    return <div className="page-loading">Calculating your career matches...</div>;
  }

  return (
    <div className="careers-page">
      <h1>Career Matches</h1>
      <p className="page-subtitle">
        Roles are ranked by <strong>job readiness</strong>. Skills you proved with a challenge count fully,
        skills you only claimed count partly.
      </p>

      {matches.length === 0 ? (
        <p className="empty-state">
          You haven't added any skills yet. Go to the Skills page to add some!
        </p>
      ) : (
        <div className="career-list">
          {matches.map((match) => (
            <div key={match.roleId} className="career-card" onClick={() => toggleExpand(match.roleId)}>
              <div className="career-card-header">
                <div>
                  <h3>{match.title}</h3>
                  <span className="career-category">{match.category}</span>
                </div>
                <span
                  className={`match-badge ${
                    match.readinessScore >= 70
                      ? "match-high"
                      : match.readinessScore >= 40
                      ? "match-medium"
                      : "match-low"
                  }`}
                >
                  {match.readinessScore}% ready
                </span>
              </div>

              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${match.readinessScore}%` }}></div>
              </div>
              <p className="career-match-info">
                {match.verifiedCount} verified, {match.claimedOnlyCount} claimed only, {match.missingCount}{" "}
                missing (profile match: {match.matchPercentage}%)
              </p>

              <p className="career-description">{match.description}</p>

              {expandedId === match.roleId && (
                <div className="career-details" onClick={(e) => e.stopPropagation()}>
                  <p className="career-salary">
                    <strong>Average Salary:</strong> {match.averageSalaryINR}
                  </p>

                  <div className="tags-list">
                    {match.skillStatuses.map((s) => (
                      <span key={s.skill} className={`skill-tag ${STATUS_CLASS[s.status]}`}>
                        {s.skill}
                      </span>
                    ))}
                  </div>
                  <p className="passport-legend">Green: verified. Amber: claimed only. Red: missing.</p>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => handleSetTarget(e, match.roleId)}
                  >
                    Build my roadmap for this role
                  </button>
                </div>
              )}

              <button className="btn-link">
                {expandedId === match.roleId ? "Show less ▲" : "Show details ▼"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Careers;
