import { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import "../../assets/styles.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const AVATAR_PALETTE = ["#0891b2", "#db2777", "#7c3aed", "#10b981", "#d97706", "#2563eb"];

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorForId(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function isOverdue(task) {
  return task.deadline && new Date(task.deadline) < new Date() && task.status !== "Completed";
}

function projectStatusBadge(project, progress, hasOverdueTask) {
  if (project.status === "Completed") {
    return { label: "Completed", color: "#6b7280", bg: "#f3f4f6" };
  }
  if (hasOverdueTask) {
    return { label: "Overdue", color: "#ef4444", bg: "#fee2e2" };
  }
  if (progress < 40) {
    return { label: "At risk", color: "#d97706", bg: "#fef3c7" };
  }
  return { label: "On track", color: "#14b8a6", bg: "#ccfbf1" };
}

function progressColorFor(progress) {
  if (progress >= 100) return "#14b8a6";
  if (progress >= 60) return "#3b82f6";
  if (progress >= 30) return "#fbbf24";
  return "#f87171";
}

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [projRes, taskRes, userRes] = await Promise.all([
          api.get("/projects"),
          api.get("/tasks"),
          api.get("/users"),
        ]);
        setProjects(projRes.data);
        setTasks(taskRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Failed to load admin dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const projectTasks = (projectId) => tasks.filter((t) => t.project?._id === projectId);

  const projectProgress = (projectId) => {
    const pTasks = projectTasks(projectId);
    if (pTasks.length === 0) return 0;
    const total = pTasks.reduce((sum, t) => sum + (t.progress || 0), 0);
    return Math.round(total / pTasks.length);
  };

  const stats = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status !== "Completed").length;
    const openTasks = tasks.filter((t) => t.status !== "Completed").length;
    const overdueTasks = tasks.filter(isOverdue).length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
    const avgCompletion =
      tasks.length === 0
        ? 0
        : Math.round(tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / tasks.length);

    const supervisorCount = users.filter((u) => u.role === "Supervisor").length;
    const internCount = users.filter((u) => u.role === "Internee").length;

    return {
      activeProjects,
      openTasks,
      overdueTasks,
      completedTasks,
      inProgressTasks,
      avgCompletion,
      supervisorCount,
      internCount,
      totalTasks: tasks.length,
    };
  }, [projects, tasks, users]);

  const priorityData = useMemo(() => {
    const buckets = { Low: 0, Medium: 0, High: 0 };
    tasks.forEach((t) => {
      if (buckets[t.priority] !== undefined) buckets[t.priority]++;
    });
    return [
      { priority: "Low", count: buckets.Low },
      { priority: "Medium", count: buckets.Medium },
      { priority: "High", count: buckets.High },
    ];
  }, [tasks]);

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <p style={{ padding: "24px" }}>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="dashboard-header">
          <h1>Organization Overview</h1>
          <p>Real-time status across every division project.</p>
        </div>

        <div className="ap-stats">
          <div className="ap-stat-card" style={{ borderLeftColor: "#14b8a6" }}>
            <div className="ap-stat-num" style={{ color: "#14b8a6" }}>{stats.activeProjects}</div>
            <div className="ap-stat-label">Active Projects</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#2563eb" }}>
            <div className="ap-stat-num" style={{ color: "#2563eb" }}>{stats.openTasks}</div>
            <div className="ap-stat-label">Open Tasks</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#ef4444" }}>
            <div className="ap-stat-num" style={{ color: "#ef4444" }}>{stats.overdueTasks}</div>
            <div className="ap-stat-label">Overdue Tasks</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#d97706" }}>
            <div className="ap-stat-num" style={{ color: "#d97706" }}>{stats.avgCompletion}%</div>
            <div className="ap-stat-label">Avg Completion</div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="chart-card">
            <p className="section-label">TASKS BY PRIORITY</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="priority" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="status-card">
            <p className="section-label">TASK STATUS</p>

            <div className="status-row">
              <span className="status-name">Completed</span>
              <span className="status-count">{stats.completedTasks}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${stats.totalTasks ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%`,
                  background: "#14b8a6",
                }}
              ></div>
            </div>

            <div className="status-row">
              <span className="status-name">In Progress</span>
              <span className="status-count">{stats.inProgressTasks}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${stats.totalTasks ? (stats.inProgressTasks / stats.totalTasks) * 100 : 0}%`,
                  background: "#fbbf24",
                }}
              ></div>
            </div>

            <div className="status-row">
              <span className="status-name">Overdue</span>
              <span className="status-count">{stats.overdueTasks}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${stats.totalTasks ? (stats.overdueTasks / stats.totalTasks) * 100 : 0}%`,
                  background: "#f87171",
                }}
              ></div>
            </div>

            <p className="section-label" style={{ marginTop: "24px" }}>HEADCOUNT</p>
            <div className="headcount-row">
              <span>Supervisors</span>
              <span className="headcount-num">{stats.supervisorCount}</span>
            </div>
            <div className="headcount-row">
              <span>Internees</span>
              <span className="headcount-num">{stats.internCount}</span>
            </div>
          </div>
        </div>

        <div className="projects-section">
          <div className="projects-header">
            <span className="section-label">PROJECTS — ALL DIVISIONS</span>
          </div>

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
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const pTasks = projectTasks(p._id);
                  const progress = projectProgress(p._id);
                  const completedCount = pTasks.filter((t) => t.status === "Completed").length;
                  const hasOverdueTask = pTasks.some(isOverdue);
                  const badge = projectStatusBadge(p, progress, hasOverdueTask);
                  const supName = p.supervisor?.name || "Unassigned";
                  const supInitials = p.supervisor ? getInitials(p.supervisor.name) : "?";
                  const supColor = p.supervisor ? colorForId(p.supervisor._id) : "#9ca3af";

                  return (
                    <tr key={p._id}>
                      <td>
                        <div className="project-name">{p.projectName}</div>
                        <div className="project-meta">
                          {pTasks.length} tasks
                          {p.startDate ? ` · ${new Date(p.startDate).toLocaleDateString()}` : ""}
                        </div>
                      </td>
                      <td>
                        <div className="supervisor-cell">
                          <div className="avatar" style={{ background: supColor }}>
                            {supInitials}
                          </div>
                          <span>{supName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="table-progress-bar">
                          <div
                            className="table-progress-fill"
                            style={{ width: `${progress}%`, background: progressColorFor(progress) }}
                          ></div>
                        </div>
                      </td>
                      <td className="tasks-cell">{completedCount}/{pTasks.length}</td>
                      <td className="deadline-cell">
                        {p.endDate ? new Date(p.endDate).toLocaleDateString() : "—"}
                      </td>
                      <td>
                        <span className="status-badge" style={{ color: badge.color, background: badge.bg }}>
                          <span className="status-dot" style={{ background: badge.color }}></span>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;