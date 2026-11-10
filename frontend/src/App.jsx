import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Skills from "./pages/Skills";
import Resume from "./pages/Resume";
import Careers from "./pages/Careers";
import Roadmap from "./pages/Roadmap";
import Challenge from "./pages/Challenge";
import Passport from "./pages/Passport";

// This is the root component. React Router DOM reads the current URL and
// renders the matching <Route> element inside the <Routes> block below.
function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes wrapped in ProtectedRoute require the user to be logged in */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <Skills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <Resume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/careers"
            element={
              <ProtectedRoute>
                <Careers />
              </ProtectedRoute>
            }
          />

          {/* NEW: roadmap + skill verification */}
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenge/:skill"
            element={
              <ProtectedRoute>
                <Challenge />
              </ProtectedRoute>
            }
          />
          {/* Your own passport needs login; a shared passport link is public. */}
          <Route
            path="/passport"
            element={
              <ProtectedRoute>
                <Passport />
              </ProtectedRoute>
            }
          />
          <Route path="/passport/:id" element={<Passport />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
