import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Skill<span>Sync</span>
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/skills">Skills</Link>
            <Link to="/resume">Resume</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/roadmap">Roadmap</Link>
            <Link to="/passport">Passport</Link>
            <span className="navbar-username">Hi, {user.name.split(" ")[0]}</span>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
