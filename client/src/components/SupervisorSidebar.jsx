import logo from "../assets/logo-bg.png";
import "../assets/styles.css";
import { NavLink, useNavigate } from "react-router-dom";

function SupervisorSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "S";

  return (
    <div className="supervisor-sidebar">

      {/* PTS Logo - same image + structure as Admin and Intern */}
      <div className="ss-logo-section">
        <div className="ss-logo-icon">
          <img src={logo} alt="PTS Logo" className="ss-logo-img" />
        </div>
      </div>

      <div className="ss-menu-section">
        <p className="ss-section-title">WORKSPACE</p>

        <NavLink to="/supervisor/dashboard">
          {({ isActive }) => (
            <div className={isActive ? "ss-menu-item active" : "ss-menu-item"}>
              Dashboard
            </div>
          )}
        </NavLink>

        <NavLink to="/supervisor/projects">
          {({ isActive }) => (
            <div className={isActive ? "ss-menu-item active" : "ss-menu-item"}>
              My Projects
            </div>
          )}
        </NavLink>

        <NavLink to="/supervisor/team">
          {({ isActive }) => (
            <div className={isActive ? "ss-menu-item active" : "ss-menu-item"}>
              Team
            </div>
          )}
        </NavLink>
      </div>

      <div className="ss-menu-section">
        <p className="ss-section-title">INSIGHTS</p>

        <NavLink to="/supervisor/reports">
          {({ isActive }) => (
            <div className={isActive ? "ss-menu-item active" : "ss-menu-item"}>
              Reports
            </div>
          )}
        </NavLink>

        <NavLink to="/supervisor/notifications">
          {({ isActive }) => (
            <div className={isActive ? "ss-menu-item active" : "ss-menu-item"}>
              Notifications
              <span className="ss-badge">3</span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Profile + Logout - matches Admin/Intern structure exactly */}
      <div className="ss-profile-section">
        <div className="ss-avatar">{initials}</div>
        <div className="ss-profile-info">
          <h4>{user.name || "Supervisor"}</h4>
          <p>{user.role || "SUPERVISOR"}</p>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

    </div>
  );
}

export default SupervisorSidebar;
