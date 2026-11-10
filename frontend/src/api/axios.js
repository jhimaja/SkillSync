import axios from "axios";

// We create ONE central Axios instance so every API call in the app
// automatically uses the same base URL and settings.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// This is an Axios "interceptor" - a function that runs automatically
// before EVERY request is sent. Here, we attach the JWT token (if the
// student is logged in) to the Authorization header, so protected backend
// routes accept the request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillsync_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
