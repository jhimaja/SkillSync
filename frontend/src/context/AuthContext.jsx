import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

// React Context lets us share data (like "is the user logged in?") across
// many components WITHOUT manually passing props down through every level.
const AuthContext = createContext();

// Custom hook: any component can call useAuth() to access login state
// and login/logout functions, instead of importing AuthContext directly.
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app first loads, check if a token already exists in
  // localStorage (meaning the student was previously logged in).
  useEffect(() => {
    const token = localStorage.getItem("skillsync_token");
    const savedUser = localStorage.getItem("skillsync_user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user: loggedInUser } = response.data;

    localStorage.setItem("skillsync_token", token);
    localStorage.setItem("skillsync_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return loggedInUser;
  };

  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    const { token, user: newUser } = response.data;

    localStorage.setItem("skillsync_token", token);
    localStorage.setItem("skillsync_user", JSON.stringify(newUser));
    setUser(newUser);

    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("skillsync_token");
    localStorage.removeItem("skillsync_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
