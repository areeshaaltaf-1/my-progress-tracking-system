import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InternSidebar from "../../components/InternSidebar";
import { internProjectsData } from "../../data/InternProjectsData";
import "../../assets/styles.css";

const STATUS_STYLES = {
  Overdue: "it-badge overdue",
  "In progress": "it-badge progress",
  "Not started": "it-badge notstarted",
  Completed: "it-badge completed",
};

export default function InternTasks() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filters = ["All", "This week", "Overdue"];

  // If a projectId is in the URL, show only that project's tasks.
  // Otherwise, show every task across every project (flat list).
  const activeProject = projectId
    ? internProjectsData.find((p) => p.id === Number(projectId))
    : null;

  const tasksData = activeProject
    ? activeProject.tasks
    : internProjectsData.flatMap((p) => p.tasks);

  const filtered = tasksData.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" || (filter === "Overdue" ? t.status === "Overdue" : true);
    return matchSearch && matchFilter;
  });

  const assigned = tasksData.length;
  const inProgress = tasksData.filter((t) => t.status === "In progress").length;
  const overdue = tasksData.filter((t) => t.status === "Overdue").length;
  const avgProgress = tasksData.length
    ? Math.round(tasksData.reduce((a, t) => a + t.progress, 0) / tasksData.length)
    : 0;

  if (projectId && !activeProject) {
    return (
      <div className="smp-layout">
        <InternSidebar />
        <main className="smp-main it-main">
          <p>Project not found.</p>
          <button className="btn-primary" onClick={() => navigate("/intern/projects")}>
            Back to My Projects
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="smp-layout">
      <InternSidebar />

      <main className="smp-main it-main">
        <div className="it-topbar">
          <div className="it-search-wrap">
            <svg className="smp-search-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#9ca3af" strokeWidth="1.8" />
              <path d="M13.5 13.5L17 17" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              className="it-search"
              placeholder="Search my tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="it-filters">
            {filters.map((f) => (
              <button
                key={f}
                className={`it-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {activeProject ? (
          <>
            <p className="it-subtitle" style={{ marginBottom: 4 }}>
              MY PROJECTS / {activeProject.name}
            </p>
            <h1 className="it-title">{activeProject.name}</h1>
            <p className="it-subtitle">Tasks assigned to you for this project</p>
          </>
        ) : (
          <>
            <h1 className="it-title">My Tasks</h1>
            <p className="it-subtitle">Everything assigned to you, sorted by deadline</p>
          </>
        )}

        <div className="it-stats">
          <div className="it-stat-card">
            <span className="it-stat-label">ASSIGNED</span>
            <span className="it-stat-value">{assigned}</span>
            <span className="it-stat-sub">
              {activeProject ? activeProject.name : `across ${internProjectsData.length} projects`}
            </span>
          </div>
          <div className="it-stat-card">
            <span className="it-stat-label yellow">IN PROGRESS</span>
            <span className="it-stat-value yellow">{inProgress}</span>
            <span className="it-stat-sub">avg {avgProgress}% complete</span>
          </div>
          <div className="it-stat-card">
            <span className="it-stat-label red">OVERDUE</span>
            <span className="it-stat-value red">{overdue}</span>
            <span className="it-stat-sub">flagged to supervisor</span>
          </div>
        </div>

        <div className="it-active-header">
          <span className="it-active-label">ACTIVE TASKS</span>
        </div>

        {filtered.length === 0 ? (
          <div className="smp-empty">No tasks match your search.</div>
        ) : (
          <div className="it-task-list">
            {filtered.map((task) => (
              <div
                key={task.id}
                className={`it-task-row ${task.status === "Overdue" ? "overdue" : ""} ${
                  task.status === "Completed" ? "completed" : ""
                }`}
              >
                <div className="it-task-top">
                  <div>
                    <h3 className="it-task-title">{task.title}</h3>
                    <p className="it-task-supervisor">Supervisor: {task.supervisor}</p>
                  </div>
                  <span className={STATUS_STYLES[task.status]}>
                    <span className="it-badge-dot" />
                    {task.status}
                    {task.overdueDays ? ` · ${task.overdueDays} days` : ""}
                  </span>
                </div>

                <div className="it-progress-track">
                  <div
                    className="it-progress-fill"
                    style={{
                      width: `${task.progress}%`,
                      background:
                        task.status === "Overdue"
                          ? "#ef4444"
                          : task.status === "Completed"
                          ? "#22c55e"
                          : "#10b981",
                    }}
                  />
                </div>

                <div className="it-task-footer">
                  <span>{task.progress}%</span>
                  <span>{task.dueLabel}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}