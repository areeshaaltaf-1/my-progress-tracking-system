import logo from "../assets/logo-bg.png";
import "../assets/styles.css";
import { NavLink, useNavigate } from "react-router-dom";

function InternSidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "IN";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="intern-sidebar">
 {/* Single PTS logo icon - matches Intern/Supervisor sidebars */}
    
 <div className="logo-section">
  <div className="pts-logo-icon">
    <img src={logo} alt="PTS Logo" className="pts-logo-img" />
  </div>
</div>

      

      <div className="is-menu-section">
        <p className="is-section-title">MY WORK</p>

        <NavLink to="/intern/tasks">
          {({ isActive }) => (
            <div className={isActive ? "is-menu-item active" : "is-menu-item"}>
              My Tasks
            </div>
          )}
        </NavLink>

        <NavLink to="/intern/work-log">
          {({ isActive }) => (
            <div className={isActive ? "is-menu-item active" : "is-menu-item"}>
              Work Log
            </div>
          )}
        </NavLink>

        <NavLink to="/intern/projects">
          {({ isActive }) => (
            <div className={isActive ? "is-menu-item active" : "is-menu-item"}>
              My Projects
            </div>
          )}
        </NavLink>
      </div>

      <div className="is-menu-section">
        <p className="is-section-title">UPDATES</p>

        <NavLink to="/intern/notifications">
          {({ isActive }) => (
            <div className={isActive ? "is-menu-item active" : "is-menu-item"}>
              Notifications
              <span className="is-badge">2</span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Profile + Logout at bottom */}
      <div className="is-profile-section">
        <div className="is-avatar">{initials}</div>
        <div className="is-profile-info">
          <h4>{user.name || "Intern"}</h4>
          <p>{user.role || "INTERNEE"}</p>
          <button className="is-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

    </div>
  );
}

export default InternSidebar;
