import "../assets/styles.css";
import { NavLink } from "react-router-dom";

function InternSidebar() {
  return (
    <div className="intern-sidebar">
      <div className="is-logo-section">
        <div className="is-logo-icon">S</div>
        <div>
          <h1 className="is-logo">SIGNAL</h1>
          <span className="is-logo-subtitle">INTERNEE</span>
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

      <div className="is-profile-section">
        <div className="is-avatar">HM</div>
        <div>
          <h4>Hamza Malik</h4>
          <p>INTERNEE</p>
        </div>
      </div>
    </div>
  );
}

export default InternSidebar;