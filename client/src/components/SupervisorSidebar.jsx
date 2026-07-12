
import "../assets/styles.css";
import { NavLink } from "react-router-dom";

function SupervisorSidebar() {
  return (
    <div className="supervisor-sidebar">

      <div className="ss-logo-section">
        <div className="ss-logo-icon">S</div>
        <div>
          <h1 className="ss-logo">SIGNAL</h1>
          <span className="ss-logo-subtitle">SUPERVISOR</span>
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

      <div className="ss-profile-section">
        <div className="ss-avatar">AR</div>
        <div>
          <h4>Ahmed Raza</h4>
          <p>SUPERVISOR</p>
        </div>
      </div>

    </div>
  );
}

export default SupervisorSidebar;
