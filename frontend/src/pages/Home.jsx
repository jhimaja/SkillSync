import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <h1>
          Don't just learn the skills. <br />
          Prove you are <span className="highlight">job-ready</span>.
        </h1>
        <p>
          Most platforms only tell you which skills you need. SkillSync finds
          your skill gap, builds a personal learning roadmap, and verifies
          every skill with a practical challenge, so you can show employers
          proof instead of a list.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="how-it-works">
        <div className="how-step">
          <h3>1. Find the gap</h3>
          <p>Pick a target role. We compare it with your skills and show exactly what is missing.</p>
        </div>
        <div className="how-step">
          <h3>2. Follow your roadmap</h3>
          <p>Get an ordered plan with study hours, free resources, a practice project and a finish date.</p>
        </div>
        <div className="how-step">
          <h3>3. Prove each skill</h3>
          <p>Pass practical challenges, including real code graded on the server, to earn verified badges.</p>
        </div>
        <div className="how-step">
          <h3>4. Share your passport</h3>
          <p>Send recruiters a single link that lists only the skills you have actually proved.</p>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Job Readiness Score</h3>
          <p>Verified skills count fully; claimed skills count partly. The score is honest.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🗺️</div>
          <h3>Personal Roadmap</h3>
          <p>Prerequisites first, with hours and weeks based on your own weekly time.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✅</div>
          <h3>Practical Verification</h3>
          <p>Scenario questions and auto-graded coding tasks, not self-rating.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h3>Profile and Resume</h3>
          <p>Keep your details, skills and resume in one place.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
