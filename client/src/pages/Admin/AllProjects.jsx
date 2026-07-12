import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../assets/styles.css";
import { useState } from "react";

const allProjects = [
  {
    name: "SOC Playbook Automation",
    meta: "12 tasks · 2 May",
    supervisor: "Ahmed Raza",
    initials: "AR",
    avatarColor: "#0891b2",
    progress: 78,
    progressColor: "#14b8a6",
    tasks: "9/12",
    deadline: "14 Jul",
    deadlineColor: "#374151",
    status: "On track",
    statusColor: "#14b8a6",
    statusBg: "#ccfbf1",
  },
  {
    name: "Phishing Simulation Suite",
    meta: "8 tasks · 18 May",
    supervisor: "Zara Fatima",
    initials: "ZF",
    avatarColor: "#db2777",
    progress: 45,
    progressColor: "#fbbf24",
    tasks: "4/8",
    deadline: "02 Jul",
    deadlineColor: "#d97706",
    status: "At risk",
    statusColor: "#d97706",
    statusBg: "#fef3c7",
  },
  {
    name: "Network Hardening Audit",
    meta: "15 tasks · 30 Apr",
    supervisor: "Bilal Khan",
    initials: "BK",
    avatarColor: "#7c3aed",
    progress: 22,
    progressColor: "#f87171",
    tasks: "3/15",
    deadline: "28 Jun",
    deadlineColor: "#ef4444",
    status: "Overdue",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
  },
  {
    name: "SIEM Dashboard Revamp",
    meta: "6 tasks · 10 Jun",
    supervisor: "Ahmed Raza",
    initials: "AR",
    avatarColor: "#0891b2",
    progress: 100,
    progressColor: "#14b8a6",
    tasks: "6/6",
    deadline: "25 Jun",
    deadlineColor: "#9ca3af",
    status: "Completed",
    statusColor: "#6b7280",
    statusBg: "#f3f4f6",
  },
  {
    name: "VAPT Automation Suite",
    meta: "10 tasks · 1 Jun",
    supervisor: "Zara Fatima",
    initials: "ZF",
    avatarColor: "#db2777",
    progress: 60,
    progressColor: "#14b8a6",
    tasks: "6/10",
    deadline: "20 Jul",
    deadlineColor: "#374151",
    status: "On track",
    statusColor: "#14b8a6",
    statusBg: "#ccfbf1",
  },
  {
    name: "Security Awareness Training",
    meta: "5 tasks · 15 Jun",
    supervisor: "Bilal Khan",
    initials: "BK",
    avatarColor: "#7c3aed",
    progress: 40,
    progressColor: "#fbbf24",
    tasks: "2/5",
    deadline: "10 Jul",
    deadlineColor: "#d97706",
    status: "At risk",
    statusColor: "#d97706",
    statusBg: "#fef3c7",
  },
];

function AllProjects() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);

  // Filter logic
  const filtered = allProjects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        {/* Header */}
        <div className="ap-header">
          <div>
            <h1 className="ap-title">All Projects</h1>
            <p className="ap-sub">Manage and monitor every division project</p>
          </div>
          <button className="btn-new" onClick={() => setShowModal(true)}>
            + New Project
          </button>
        </div>

        {/* Stats Row */}
        <div className="ap-stats">
          <div className="ap-stat-card" style={{ borderLeftColor: "#14b8a6" }}>
            <div className="ap-stat-num" style={{ color: "#14b8a6" }}>6</div>
            <div className="ap-stat-label">Total Projects</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#2563eb" }}>
            <div className="ap-stat-num" style={{ color: "#2563eb" }}>4</div>
            <div className="ap-stat-label">Active</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#ef4444" }}>
            <div className="ap-stat-num" style={{ color: "#ef4444" }}>1</div>
            <div className="ap-stat-label">Overdue</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#6b7280" }}>
            <div className="ap-stat-num" style={{ color: "#6b7280" }}>1</div>
            <div className="ap-stat-label">Completed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="ap-filters">
          <input
            className="ap-search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="ap-filter-btns">
            {["All", "On track", "At risk", "Overdue", "Completed"].map((s) => (
              <button
                key={s}
                className={`filter-btn ${filterStatus === s ? "active" : ""}`}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>PROJECT</th>
                <th>SUPERVISOR</th>
                <th>PROGRESS</th>
                <th>TASKS</th>
                <th>DEADLINE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-results">
                    No projects found
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div className="project-name">{p.name}</div>
                      <div className="project-meta">{p.meta}</div>
                    </td>
                    <td>
                      <div className="supervisor-cell">
                        <div
                          className="avatar"
                          style={{ background: p.avatarColor }}
                        >
                          {p.initials}
                        </div>
                        <span>{p.supervisor}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-progress-bar">
                        <div
                          className="table-progress-fill"
                          style={{
                            width: `${p.progress}%`,
                            background: p.progressColor,
                          }}
                        ></div>
                      </div>
                      <span className="progress-pct">{p.progress}%</span>
                    </td>
                    <td className="tasks-cell">{p.tasks}</td>
                    <td
                      className="deadline-cell"
                      style={{ color: p.deadlineColor }}
                    >
                      {p.deadline}
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          color: p.statusColor,
                          background: p.statusBg,
                        }}
                      >
                        <span
                          className="status-dot"
                          style={{ background: p.statusColor }}
                        ></span>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-view">View</button>
                        <button className="btn-edit">Edit</button>
                        <button className="btn-delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total count */}
        <div className="ap-footer">
          Showing {filtered.length} of {allProjects.length} projects
        </div>
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Project Title</label>
                <input placeholder="e.g. SOC Playbook Automation" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" placeholder="What is this project about?" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Supervisor</label>
                  <select>
                    <option>Ahmed Raza</option>
                    <option>Zara Fatima</option>
                    <option>Bilal Khan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input type="date" />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-create">Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllProjects;