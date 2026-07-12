import "../assets/styles.css";

function Navbar() {
  return (
    <div className="navbar">
      <input
        type="text"
        placeholder="Search projects, tasks, people..."
      />

      <div className="navbar-right">
        <button className="status-btn">
          All systems normal
        </button>

        <button className="project-btn">
          + New Project
        </button>
      </div>
    </div>
  );
}

export default Navbar;