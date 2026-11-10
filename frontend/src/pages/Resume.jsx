import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setResume(res.data.user.resume);
    } catch (err) {
      console.error("Failed to load resume info", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please choose a file first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResume(res.data.resume);
      setSelectedFile(null);
      setMessage("Resume uploaded successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await api.get("/resume/download", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", resume?.fileName || "resume");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Failed to download resume");
    }
  };

  return (
    <div className="form-page">
      <h1>My Resume</h1>
      <p className="page-subtitle">Upload your resume so it's always ready to share.</p>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card-form">
        {resume?.fileName ? (
          <div className="resume-current">
            <div className="resume-icon">📄</div>
            <div>
              <p className="resume-filename">{resume.fileName}</p>
              <p className="resume-date">
                Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <button className="btn btn-outline" onClick={handleDownload}>
              Download
            </button>
          </div>
        ) : (
          <p className="empty-state">No resume uploaded yet.</p>
        )}

        <form onSubmit={handleUpload} className="resume-upload-form">
          <div className="form-group">
            <label htmlFor="resumeFile">
              {resume?.fileName ? "Replace Resume" : "Upload Resume"} (PDF or Word, max 5MB)
            </label>
            <input
              type="file"
              id="resumeFile"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resume;
