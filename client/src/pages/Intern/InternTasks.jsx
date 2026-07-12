import { useState } from "react";
import InternSidebar from "../../components/InternSidebar";
import "../../assets/styles.css";

const tasksData = [
  {
    id: 1,
    title: "Close firewall gaps list — Network Hardening",
    supervisor: "Bilal Khan",
    progress: 20,
    status: "Overdue",
    dueLabel: "was due 28 Jun",
    overdueDays: 2,
  },
  {
    id: 2,
    title: "Automate phishing-report triage playbook",
    supervisor: "Ahmed Raza",
    progress: 60,
    status: "In progress",
    dueLabel: "due in 3 days",
  },
  {
    id: 3,
    title: "Write detection rules for lateral movement",
    supervisor: "Ahmed Raza",
    progress: 0,
    status: "Not started",
    dueLabel: "due 05 Jul",
  },
  {
    id: 4,
    title: "Define playbook taxonomy & tagging",
    supervisor: "Ahmed Raza",
    progress: 100,
    status: "Completed",
    dueLabel: "completed",
  },
];

const STATUS_STYLES = {
  Overdue: "it-badge overdue",
  "In progress": "it-badge progress",
  "Not started": "it-badge notstarted",
  Completed: "it-badge completed",
};

export default function InternTasks() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filters = ["All", "This week", "Overdue"];

  const filtered = tasksData.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || (filter === "Overdue" ? t.status === "Overdue" : true);
    return matchSearch && matchFilter;
  });

  const assigned = tasksData.length;
  const inProgress = tasksData.filter((t) => t.status === "In progress").length;
  const overdue = tasksData.filter((t) => t.status === "Overdue").length;
  const avgProgress = Math.round(
    tasksData.reduce((a, t) => a + t.progress, 0) / tasksData.length
  );

  return (
    <div className="smp-layout it-page">
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
          {overdue > 0 && (
            <span className="it-overdue-pill">
              <span className="it-overdue-dot" />
              {overdue} overdue
            </span>
          )}
        </div>

        <h1 className="it-title">My Tasks</h1>
        <p className="it-subtitle">Everything assigned to you, sorted by deadline</p>

        <div className="it-stats">
          <div className="it-stat-card">
            <span className="it-stat-label">ASSIGNED</span>
            <span className="it-stat-value">{assigned}</span>
            <span className="it-stat-sub">across 3 projects</span>
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