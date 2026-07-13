import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InternSidebar from "../../components/InternSidebar";
import { internProjectsData } from "../../data/InternProjectsData";
import "../../assets/styles.css";

const STATUS_COLORS = {
  "In Progress": { bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6" },
  Planning: { bg: "#f5f3ff", text: "#7c3aed", dot: "#7c3aed" },
  Completed: { bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e" },
};

export default function InternMyProjects() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const filters = ["All", "In Progress", "Planning", "Completed"];

  const filtered = internProjectsData.filter((p) => {
    const matchStatus = filter === "All" || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="smp-layout">
      <InternSidebar />

      <main className="smp-main">
        <div className="smp-header">
          <div>
            <p className="smp-breadcrumb">MY WORK / MY PROJECTS</p>
            <h1 className="smp-title">My Projects</h1>
          </div>
        </div>

        <div className="smp-toolbar">
          <div className="smp-search-wrap">
            <svg className="smp-search-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#9ca3af" strokeWidth="1.8" />
              <path d="M13.5 13.5L17 17" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              className="smp-search"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="smp-filters">
            {filters.map((f) => (
              <button
                key={f}
                className={`smp-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
                <span className="smp-filter-count">
                  {f === "All"
                    ? internProjectsData.length
                    : internProjectsData.filter((p) => p.status === f).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="smp-stats">
          {[
            { label: "Assigned Projects", value: internProjectsData.length },
            {
              label: "In Progress",
              value: internProjectsData.filter((p) => p.status === "In Progress").length,
            },
            {
              label: "My Tasks Total",
              value: internProjectsData.reduce((a, p) => a + p.tasks.length, 0),
            },
            {
              label: "Avg Progress",
              value:
                Math.round(
                  internProjectsData.reduce((a, p) => a + p.progress, 0) /
                    internProjectsData.length
                ) + "%",
            },
          ].map((s) => (
            <div className="smp-stat-card" key={s.label}>
              <span className="smp-stat-value">{s.value}</span>
              <span className="smp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="smp-empty">No projects match your search.</div>
        ) : (
          <div className="smp-grid">
            {filtered.map((project) => {
              const sta = STATUS_COLORS[project.status];
              const progressColor =
                project.progress === 100
                  ? "#22c55e"
                  : project.progress >= 60
                  ? "#3b82f6"
                  : project.progress >= 30
                  ? "#f59e0b"
                  : "#ef4444";

              return (
                <div
                  className="smp-card"
                  key={project.id}
                  onClick={() => navigate(`/intern/tasks/${project.id}`)}
                >
                  <div className="smp-card-top">
                    <span
                      className="smp-status-badge"
                      style={{ background: sta.bg, color: sta.text }}
                    >
                      <span className="smp-status-dot" style={{ background: sta.dot }} />
                      {project.status}
                    </span>
                  </div>

                  <h3 className="smp-card-name">{project.name}</h3>
                  <p className="smp-card-desc">{project.description}</p>

                  <div className="smp-progress-row">
                    <span className="smp-progress-label">Progress</span>
                    <span className="smp-progress-pct" style={{ color: progressColor }}>
                      {project.progress}%
                    </span>
                  </div>
                  <div className="smp-progress-track">
                    <div
                      className="smp-progress-fill"
                      style={{ width: `${project.progress}%`, background: progressColor }}
                    />
                  </div>

                  <div className="smp-card-footer">
                    <span className="smp-chip">{project.tasks.length} of my tasks</span>
                    <span className="smp-chip">Supervisor: {project.supervisor}</span>
                    <span className="smp-deadline">Due: {project.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}