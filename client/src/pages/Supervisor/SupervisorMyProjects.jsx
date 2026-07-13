import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SupervisorSidebar from "../../components/SupervisorSidebar";
import { projectsData } from "../../data/ProjectsData";
import "../../assets/styles.css";

const PRIORITY_COLORS = {
  High: { bg: "#fee2e2", text: "#dc2626" },
  Medium: { bg: "#fef9c3", text: "#ca8a04" },
  Low: { bg: "#dcfce7", text: "#16a34a" },
};

const STATUS_COLORS = {
  "In Progress": { bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6" },
  Planning: { bg: "#f5f3ff", text: "#7c3aed", dot: "#7c3aed" },
  Completed: { bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e" },
};

export default function SupervisorMyProjects() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filters = ["All", "In Progress", "Planning", "Completed"];

  const filtered = projectsData.filter((p) => {
    const matchStatus = filter === "All" || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="smp-layout">
      <SupervisorSidebar />

      <main className="smp-main">
        <div className="smp-header">
          <div>
            <p className="smp-breadcrumb">WORKSPACE / DASHBOARD</p>
            <h1 className="smp-title">Dashboard</h1>
          </div>
          <button className="smp-new-btn">+ New Project</button>
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
                    ? projectsData.length
                    : projectsData.filter((p) => p.status === f).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="ap-stats">
          <div className="ap-stat-card" style={{ borderLeftColor: "#14b8a6" }}>
            <div className="ap-stat-num" style={{ color: "#14b8a6" }}>{projectsData.length}</div>
            <div className="ap-stat-label">Total Projects</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#2563eb" }}>
            <div className="ap-stat-num" style={{ color: "#2563eb" }}>
              {projectsData.filter((p) => p.status === "In Progress").length}
            </div>
            <div className="ap-stat-label">In Progress</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#6b7280" }}>
            <div className="ap-stat-num" style={{ color: "#6b7280" }}>
              {projectsData.filter((p) => p.status === "Completed").length}
            </div>
            <div className="ap-stat-label">Completed</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#d97706" }}>
            <div className="ap-stat-num" style={{ color: "#d97706" }}>
              {Math.round(
                projectsData.reduce((a, p) => a + p.progress, 0) / projectsData.length
              )}%
            </div>
            <div className="ap-stat-label">Avg Progress</div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="smp-empty">No projects match your search.</div>
        ) : (
          <div className="smp-grid">
            {filtered.map((project) => {
              const pri = PRIORITY_COLORS[project.priority];
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
                  onClick={() => navigate(`/supervisor/dashboard/${project.id}`)}
                >
                  <div className="smp-card-top">
                    <div className="smp-card-meta">
                      <span
                        className="smp-status-badge"
                        style={{ background: sta.bg, color: sta.text }}
                      >
                        <span className="smp-status-dot" style={{ background: sta.dot }} />
                        {project.status}
                      </span>
                      <span
                        className="smp-priority-badge"
                        style={{ background: pri.bg, color: pri.text }}
                      >
                        Priority: {project.priority}
                      </span>
                    </div>

                    <div className="smp-avatars">
                      {project.avatars.slice(0, 3).map((av, i) => (
                        <span
                          key={i}
                          className="smp-avatar"
                          style={{ background: project.colors[i] }}
                        >
                          {av}
                        </span>
                      ))}
                      {project.avatars.length > 3 && (
                        <span className="smp-avatar smp-avatar-more">
                          +{project.avatars.length - 3}
                        </span>
                      )}
                    </div>
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
                    <span className="smp-chip">{project.tasks.length} tasks</span>
                    <span className="smp-chip">{project.contributors} contributors</span>
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