import { useState } from "react";
import SupervisorSidebar from "../../components/SupervisorSidebar";
import "../../assets/styles.css";

const teamData = [
  {
    id: 1,
    name: "Zara Farooq",
    initials: "ZF",
    role: "SOC Analyst",
    email: "zara.farooq@signal.io",
    color: "#e91e8c",
    status: "Active",
    projects: 3,
    tasksCompleted: 18,
    tasksTotal: 22,
  },
  {
    id: 2,
    name: "Bilal Khan",
    initials: "BK",
    role: "Threat Hunter",
    email: "bilal.khan@signal.io",
    color: "#7c3aed",
    status: "Active",
    projects: 2,
    tasksCompleted: 11,
    tasksTotal: 15,
  },
  {
    id: 3,
    name: "Hamza Malik",
    initials: "HM",
    role: "Detection Engineer",
    email: "hamza.malik@signal.io",
    color: "#0ea5e9",
    status: "Away",
    projects: 2,
    tasksCompleted: 9,
    tasksTotal: 14,
  },
  {
    id: 4,
    name: "Ahmed Raza",
    initials: "AR",
    role: "Supervisor",
    email: "ahmed.raza@signal.io",
    color: "#10b981",
    status: "Active",
    projects: 4,
    tasksCompleted: 20,
    tasksTotal: 20,
  },
  {
    id: 5,
    name: "Noor Siddiqui",
    initials: "NS",
    role: "SOC Analyst",
    email: "noor.siddiqui@signal.io",
    color: "#f59e0b",
    status: "Active",
    projects: 1,
    tasksCompleted: 6,
    tasksTotal: 9,
  },
];

export default function SupervisorTeam() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Active", "Away"];

  const filtered = teamData.filter((m) => {
    const matchStatus = filter === "All" || m.status === filter;
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalMembers = teamData.length;
  const activeMembers = teamData.filter((m) => m.status === "Active").length;
  const totalProjects = teamData.reduce((a, m) => a + m.projects, 0);
  const avgCompletion = Math.round(
    teamData.reduce((a, m) => a + m.tasksCompleted / m.tasksTotal, 0) /
      teamData.length *
      100
  );

  return (
    <div className="smp-layout">
      <SupervisorSidebar />

      <main className="smp-main">
        <div className="smp-header">
          <div>
            <p className="smp-breadcrumb">WORKSPACE / TEAM</p>
            <h1 className="smp-title">Team</h1>
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
              placeholder="Search team members..."
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
                    ? teamData.length
                    : teamData.filter((m) => m.status === f).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="smp-stats">
          {[
            { label: "Total Members", value: totalMembers },
            { label: "Active Now", value: activeMembers },
            { label: "Assigned Projects", value: totalProjects },
            { label: "Avg Completion", value: avgCompletion + "%" },
          ].map((s) => (
            <div className="smp-stat-card" key={s.label}>
              <span className="smp-stat-value">{s.value}</span>
              <span className="smp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="smp-empty">No team members match your search.</div>
        ) : (
          <div className="st-grid">
            {filtered.map((member) => {
              const pct = Math.round(
                (member.tasksCompleted / member.tasksTotal) * 100
              );
              return (
                <div className="st-card" key={member.id}>
                  <div className="st-card-top">
                    <span
                      className="st-avatar"
                      style={{ background: member.color }}
                    >
                      {member.initials}
                    </span>
                    <span
                      className={
                        member.status === "Active"
                          ? "st-status-badge active"
                          : "st-status-badge away"
                      }
                    >
                      <span className="st-status-dot" />
                      {member.status}
                    </span>
                  </div>

                  <h3 className="st-name">{member.name}</h3>
                  <p className="st-role">{member.role}</p>
                  <p className="st-email">{member.email}</p>

                  <div className="st-divider" />

                  <div className="st-stats-row">
                    <div className="st-stat">
                      <span className="st-stat-value">{member.projects}</span>
                      <span className="st-stat-label">Projects</span>
                    </div>
                    <div className="st-stat">
                      <span className="st-stat-value">
                        {member.tasksCompleted}/{member.tasksTotal}
                      </span>
                      <span className="st-stat-label">Tasks</span>
                    </div>
                  </div>

                  <div className="smp-progress-row">
                    <span className="smp-progress-label">Task Completion</span>
                    <span className="smp-progress-pct">{pct}%</span>
                  </div>
                  <div className="smp-progress-track">
                    <div
                      className="smp-progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: pct === 100 ? "#22c55e" : "#3b82f6",
                      }}
                    />
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