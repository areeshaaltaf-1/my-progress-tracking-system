import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../assets/styles.css";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Sana Khan",
    email: "sana.khan@signal.com",
    role: "Admin",
  });

  const [password, setPassword] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [saved, setSaved] = useState(false);

  const handleProfileChange = (field) => (e) =>
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePasswordChange = (field) => (e) =>
    setPassword((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setPassword({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="settings-page">
          <div className="settings-header">
            <h1>Settings</h1>
            <p className="subtext">Manage your account details</p>
          </div>

          {/* Profile card */}
          <form className="settings-card" onSubmit={handleSaveProfile}>
            <h3>Profile</h3>

            <div className="settings-field">
              <label>Full name</label>
              <input
                type="text"
                value={profile.name}
                onChange={handleProfileChange("name")}
              />
            </div>

            <div className="settings-field">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={handleProfileChange("email")}
              />
            </div>

            <div className="settings-field">
              <label>Role</label>
              <input type="text" value={profile.role} disabled />
            </div>

            <div className="settings-actions">
              {saved && <span className="saved-text">Saved</span>}
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>

          {/* Password card */}
          <form className="settings-card" onSubmit={handleUpdatePassword}>
            <h3>Change Password</h3>

            <div className="settings-field">
              <label>Current password</label>
              <input
                type="password"
                value={password.current}
                onChange={handlePasswordChange("current")}
              />
            </div>

            <div className="settings-field">
              <label>New password</label>
              <input
                type="password"
                value={password.next}
                onChange={handlePasswordChange("next")}
              />
            </div>

            <div className="settings-field">
              <label>Confirm new password</label>
              <input
                type="password"
                value={password.confirm}
                onChange={handlePasswordChange("confirm")}
              />
            </div>

            <div className="settings-actions">
              <button type="submit" className="btn-primary">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
