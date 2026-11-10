import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    branch: "",
    graduationYear: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        const user = res.data.user;
        setFormData({
          name: user.name || "",
          college: user.college || "",
          branch: user.branch || "",
          graduationYear: user.graduationYear || "",
          bio: user.bio || "",
        });
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api.put("/profile", formData);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-loading">Loading profile...</div>;
  }

  return (
    <div className="form-page">
      <h1>My Profile</h1>
      <p className="page-subtitle">Keep your career details up to date.</p>

      {message && <div className="alert alert-success">{message}</div>}

      <form className="card-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="college">College / University</label>
            <input
              type="text"
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. XYZ Institute of Technology"
            />
          </div>

          <div className="form-group">
            <label htmlFor="branch">Branch / Course</label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="graduationYear">Graduation Year</label>
          <input
            type="number"
            id="graduationYear"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            placeholder="e.g. 2027"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Short Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            maxLength={500}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us a little about yourself and your career goals..."
          ></textarea>
          <span className="char-count">{formData.bio.length}/500</span>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
