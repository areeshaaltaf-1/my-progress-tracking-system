import "../assets/styles.css";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "A";

  return (
    <div className="sidebar">

      <div className="logo-section">
        <h1 className="logo">PTS</h1>
        <span className="logo-subtitle">ADMIN</span>
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

      <div className="profile-section">
        <div className="avatar">
          {initials}  {/* ✅ dynamic initials from localStorage */}
        </div>

        <div>
          <h4>{user.name || "Admin"}</h4>  {/* ✅ dynamic name */}
          <p>{user.role || "ADMIN"}</p>    {/* ✅ dynamic role */}
        </div>

        {/* ✅ Logout button */}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;