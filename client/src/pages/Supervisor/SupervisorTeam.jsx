import { useState, useEffect, useMemo } from "react";
import SupervisorSidebar from "../../components/SupervisorSidebar";
import api from "../../api/axios";
import "../../assets/styles.css";

const AVATAR_COLORS = ["#e91e8c", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function SupervisorTeam() {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        api.get("/projects"),
        api.get("/tasks"),
      ]);

      const myProjects = projRes.data.filter(
        (p) => p.supervisor && p.supervisor._id === currentUser.id
      );
      setProjects(myProjects);

      const myProjectIds = myProjects.map((p) => p._id);
      const myTasks = taskRes.data.filter(
        (t) => t.project && myProjectIds.includes(t.project._id)
      );
      setTasks(myTasks);
    } catch (err) {
      console.error("Failed to fetch team data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build one entry per unique intern from myTasks
  const team = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (!t.assignedTo) return;
      const id = t.assignedTo._id;
      if (!map[id]) {
        map[id] = {
          id,
          name: t.assignedTo.name,
          email: t.assignedTo.email,
          department: t.assignedTo.department,
          projectIds: new Set(),
          tasksTotal: 0,
          tasksCompleted: 0,
        };
      }
      map[id].projectIds.add(t.project._id);
     map[id].tasksTotal += 1;
map[id].progressSum = (map[id].progressSum || 0) + (t.progress || 0);
if (t.status === "Completed") map[id].tasksCompleted += 1;
    });
    return Object.values(map).map((m, i) => ({
      ...m,
      projects: m.projectIds.size,
      color: AVATAR_COLORS[i % AVATAR_COLORS.length],
      initials: getInitials(m.name),
    }));
  }, [tasks]);

  const filtered = team.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.department || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalMembers = team.length;
  const totalProjects = new Set(tasks.map((t) => t.project._id)).size;
  const avgCompletion =
  team.length === 0
    ? 0
    : Math.round(
        team.reduce((a, m) => a + m.progressSum / (m.tasksTotal || 1), 0) / team.length
      );

  if (loading) {
    return (
      <div className="smp-layout">
        <SupervisorSidebar />
        <main className="smp-main">
          <p>Loading team...</p>
        </main>
      </div>
    );
  }

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
        </div>

        <div className="smp-stats st-stats-3">
          {[
            { label: "Total Members", value: totalMembers },
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
          <div className="smp-empty">
            {team.length === 0
              ? "No interns have been assigned tasks yet."
              : "No team members match your search."}
          </div>
        ) : (
          <div className="st-grid">
            {filtered.map((member) => {
              const pct = Math.round(
  (member.progressSum / (member.tasksTotal || 1))
);
              return (
                <div className="st-card" key={member.id}>
                  <div className="st-card-top">
                    <span className="st-avatar" style={{ background: member.color }}>
                      {member.initials}
                    </span>
                  </div>

                  <h3 className="st-name">{member.name}</h3>
                  <p className="st-role">{member.department}</p>
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