import logo from "../assets/logo-bg.png";
import "../assets/styles.css";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
sessionStorage.removeItem("role");
sessionStorage.removeItem("user");
    navigate("/");
  };

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "A";

  return (
    <div className="sidebar">

      {/* Single PTS logo icon - matches Intern/Supervisor sidebars */}
    
 <div className="logo-section">
  <div className="pts-logo-icon">
    <img src={logo} alt="PTS Logo" className="pts-logo-img" />
  </div>
</div>


      <div className="menu-section">
        <p className="section-title">OVERVIEW</p>

        <NavLink to="/admin/dashboard" end>
          {({ isActive }) => (
            <div className={isActive ? "menu-item active" : "menu-item"}>
              Dashboard
            </div>
          )}
        </NavLink>

        <NavLink to="/admin/dashboard/allprojects">
          {({ isActive }) => (
            <div className={isActive ? "menu-item active" : "menu-item"}>
              All Projects
            </div>
          )}
        </NavLink>

        <NavLink to="/admin/dashboard/alltasks">
          {({ isActive }) => (
            <div className={isActive ? "menu-item active" : "menu-item"}>
              All Tasks
            </div>
          )}
        </NavLink>
      </div>

      <div className="menu-section">
        <p className="section-title">ADMINISTRATION</p>

        <NavLink to="/admin/dashboard/users">
          {({ isActive }) => (
            <div className={isActive ? "menu-item active" : "menu-item"}>
              Users & Roles
            </div>
          )}
        </NavLink>

        <NavLink to="/admin/dashboard/notifications">
          {({ isActive }) => (
            <div className={isActive ? "menu-item active" : "menu-item"}>
              Notifications
            </div>
          )}
        </NavLink>

        <NavLink to="/admin/dashboard/reports">
          {({ isActive }) => (
            <div className={isActive ? "menu-item active" : "menu-item"}>
              Reports
            </div>
          )}
        </NavLink>

        <NavLink to="/admin/dashboard/settings">
          {({ isActive }) => (
            <div className={isActive ? "menu-item active" : "menu-item"}>
              Settings
            </div>
          )}
        </NavLink>
      </div>

      {/* Profile + Logout - matches Intern/Supervisor pattern */}
      <div className="profile-section">
        <div className="avatar">{initials}</div>
        <div className="profile-info">
          <h4>{user.name || "Admin"}</h4>
          <p>{user.role || "ADMINISTRATOR"}</p>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;

/* ADD THIS TO styles.css under the NAVBAR section:

.navbar-profile {
  position: relative;
  cursor: pointer;
}

.navbar-tooltip {
  position: absolute;
  top: 44px;
  right: 0;
  background: #0f172a;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 20;
}

.navbar-tooltip::after {
  content: "";
  position: absolute;
  top: -4px;
  right: 14px;
  width: 8px;
  height: 8px;
  background: #0f172a;
  transform: rotate(45deg);
}

*/
