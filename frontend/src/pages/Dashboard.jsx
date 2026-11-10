import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [topMatches, setTopMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profileRes, roadmapRes, matchRes] = await Promise.all([
          api.get("/profile"),
          api.get("/roadmap"),
          api.get("/careers/match"),
        ]);
        setProfile(profileRes.data.user);
        setRoadmap(roadmapRes.data);
        setTopMatches((matchRes.data.matches || []).slice(0, 3));
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="page-loading">Loading your dashboard...</div>;
  }

  const target = roadmap?.target;
  const summary = roadmap?.summary;
  const nextStep = summary?.nextSkill;

  return (
    <div className="dashboard-page">
      <h1>Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
      <p className="page-subtitle">Find the gap, follow the roadmap, prove each skill.</p>

      <div className="stats-grid stats-grid-4">
        <div className="stat-card">
          <span className="stat-number">{target ? `${summary.readinessScore}%` : "-"}</span>
          <span className="stat-label">Job readiness{target ? ` for ${target.title}` : ""}</span>
          <Link to="/roadmap" className="stat-link">
            {target ? "Open roadmap →" : "Choose a target role →"}
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-number">{profile?.verifiedSkills?.length || 0}</span>
          <span className="stat-label">Verified skills</span>
          <Link to="/passport" className="stat-link">
            View Skill Passport →
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-number">{profile?.skills?.length || 0}</span>
          <span className="stat-label">Skills added</span>
          <Link to="/skills" className="stat-link">
            Manage Skills →
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-number">{profile?.resume?.fileName ? "✔" : "—"}</span>
          <span className="stat-label">Resume Status</span>
          <Link to="/resume" className="stat-link">
            {profile?.resume?.fileName ? "View Resume →" : "Upload Resume →"}
          </Link>
        </div>
      </div>

      {target && (
        <div className="dashboard-section next-step-card">
          <h2>Your next step</h2>
          {summary.jobReady ? (
            <p>
              All {summary.totalSkills} skills for {target.title} are verified. Share your{" "}
              <Link to="/passport">Skill Passport</Link>.
            </p>
          ) : (
            <p>
              {summary.totalHoursRemaining} study hours left, about {summary.weeksRemaining} weeks at{" "}
              {summary.weeklyHours} h/week. Start with <strong>{nextStep}</strong>.{" "}
              <Link to="/roadmap">See the full roadmap</Link>
            </p>
          )}
        </div>
      )}

      <div className="dashboard-section">
        <h2>Top Career Matches</h2>
        {topMatches.length === 0 ? (
          <p className="empty-state">
            Add skills to your profile to see which careers suit you best.{" "}
            <Link to="/skills">Add skills now</Link>
          </p>
        ) : (
          <div className="career-match-list">
            {topMatches.map((match) => (
              <div key={match.roleId} className="career-match-card">
                <div className="career-match-header">
                  <h3>{match.title}</h3>
                  <span className="match-badge">{match.readinessScore}% ready</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${match.readinessScore}%` }}></div>
                </div>
                <p className="career-match-info">
                  {match.verifiedCount} verified and {match.claimedOnlyCount} claimed of {match.totalRequired}{" "}
                  required skills
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
