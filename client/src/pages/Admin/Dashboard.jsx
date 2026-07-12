import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/Statcard";

import "../../assets/styles.css";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const productivityData = [
  { week: "Wk 1", Completed: 12, Opened: 10 },
  { week: "Wk 2", Completed: 18, Opened: 13 },
  { week: "Wk 3", Completed: 15, Opened: 14 },
  { week: "Wk 4", Completed: 22, Opened: 16 },
  { week: "Wk 5", Completed: 20, Opened: 17 },
  { week: "Wk 6", Completed: 28, Opened: 19 },
  { week: "Wk 7", Completed: 26, Opened: 21 },
  { week: "Wk 8", Completed: 35, Opened: 23 },
];

const projects = [
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
];

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        {/* Header */}
        <div className="dashboard-header">
          <h1>Organization Overview</h1>
          <p>Real-time status across every division project.</p>
        </div>

        {/* Stats Cards */}
        <div className="cards">
          <StatCard title="ACTIVE PROJECTS" value="14" subtitle="3 nearing deadline" color="#14b8a6" />
          <StatCard title="OPEN TASKS" value="86" subtitle="Across 22 internees" color="#2563eb" />
          <StatCard title="OVERDUE TASKS" value="7" subtitle="Needs supervisor action" color="#ef4444" />
          <StatCard title="AVG COMPLETION" value="68%" subtitle="This month" color="#d97706" />
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">

          {/* Left — Chart */}
          <div className="chart-card">
            <p className="section-label">PRODUCTIVITY — 8 WEEKS</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="Completed" stroke="#14b8a6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Opened" stroke="#93c5fd" strokeWidth={2} dot={false} strokeDasharray="5 4" />
              </LineChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot" style={{ background: "#14b8a6" }}></span>Completed</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: "#93c5fd" }}></span>Opened</span>
            </div>
          </div>

          {/* Right — Task Status */}
          <div className="status-card">
            <p className="section-label">TASK STATUS</p>

            <div className="status-row">
              <span className="status-name">Completed</span>
              <span className="status-count">142</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "54%", background: "#14b8a6" }}></div>
            </div>

            <div className="status-row">
              <span className="status-name">In Progress</span>
              <span className="status-count">86</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "33%", background: "#fbbf24" }}></div>
            </div>

            <div className="status-row">
              <span className="status-name">Overdue</span>
              <span className="status-count">7</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "13%", background: "#f87171" }}></div>
            </div>

            <p className="section-label" style={{ marginTop: "24px" }}>HEADCOUNT</p>
            <div className="headcount-row">
              <span>Supervisors</span>
              <span className="headcount-num">5</span>
            </div>
            <div className="headcount-row">
              <span>Internees</span>
              <span className="headcount-num">22</span>
            </div>
          </div>

        </div>

        {/* Projects Table */}
        <div className="projects-section">
          <div className="projects-header">
            <span className="section-label">PROJECTS — ALL DIVISIONS</span>
            <a href="#" className="view-link">view workspace →</a>
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
                {projects.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div className="project-name">{p.name}</div>
                      <div className="project-meta">{p.meta}</div>
                    </td>
                    <td>
                      <div className="supervisor-cell">
                        <div className="avatar" style={{ background: p.avatarColor }}>
                          {p.initials}
                        </div>
                        <span>{p.supervisor}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-progress-bar">
                        <div className="table-progress-fill" style={{ width: `${p.progress}%`, background: p.progressColor }}></div>
                      </div>
                    </td>
                    <td className="tasks-cell">{p.tasks}</td>
                    <td className="deadline-cell" style={{ color: p.deadlineColor }}>{p.deadline}</td>
                    <td>
                      <span className="status-badge" style={{ color: p.statusColor, background: p.statusBg }}>
                        <span className="status-dot" style={{ background: p.statusColor }}></span>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;