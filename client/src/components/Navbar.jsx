import "../assets/styles.css";
import { useState } from "react";

function Navbar() {
  const [showTooltip, setShowTooltip] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";
  const roleLabel = user.role || "Admin";

  return (
    <div className="navbar">
      <input
        type="text"
        className="navbar-search"
        placeholder="Search projects, tasks, people..."
      />

      <div
        className="navbar-profile"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="navbar-avatar">{initials}</div>
        {showTooltip && (
          <div className="navbar-tooltip">{user.name || roleLabel}</div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
