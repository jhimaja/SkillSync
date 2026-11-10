import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/index.css";

// This is the very first file that runs in our React app.
// It mounts (attaches) our whole App component onto the <div id="root">
// element that exists in index.html.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter enables page navigation using React Router DOM */}
    <BrowserRouter>
      {/* AuthProvider makes login state available to every component */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
