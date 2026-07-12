import { useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../assets/styles.css";

// ---- Mock data (swap for API data once Express/Mongo is connected) ----
const MOCK_TASKS = [
  {
    id: 1,
    title: "Configure SIEM alert rules",
    project: "SOC Playbook Automation",
    assignee: "Ahmed Raza",
    initials: "AR",
    color: "#2563eb",
    priority: "High",
    progress: 80,
    deadline: "14 Jul",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Draft phishing email templates",
    project: "Phishing Simulation Suite",
    assignee: "Zara Fatima",
    initials: "ZF",
    color: "#db2777",
    priority: "Medium",
    progress: 40,
    deadline: "02 Jul",
    status: "At Risk",
  },
  {
    id: 3,
    title: "Harden firewall rule set",
    project: "Network Hardening Audit",
    assignee: "Bilal Khan",
    initials: "BK",
    color: "#7c3aed",
    priority: "High",
    progress: 20,
    deadline: "28 Jun",
    status: "Overdue",
  },
  {
    id: 4,
    title: "Publish dashboard widgets v2",
    project: "SIEM Dashboard Revamp",
    assignee: "Ahmed Raza",
    initials: "AR",
    color: "#2563eb",
    priority: "Low",
    progress: 100,
    deadline: "25 Jun",
    status: "Completed",
  },
  {
    id: 5,
    title: "Write incident response runbook",
    project: "SOC Playbook Automation",
    assignee: "Sana Khan",
    initials: "SK",
    color: "#4f46e5",
    priority: "Medium",
    progress: 55,
    deadline: "18 Jul",
    status: "In Progress",
  },
];

const STATUS_FILTERS = ["All", "In Progress", "At Risk", "Overdue", "Completed"];

function statusClass(status) {
  switch (status) {
    case "Completed":
      return "badge badge-completed";
    case "Overdue":
      return "badge badge-overdue";
    case "At Risk":
      return "badge badge-atrisk";
    default:
      return "badge badge-progress";
  }
}

function priorityClass(priority) {
  switch (priority) {
    case "High":
      return "priority priority-high";
    case "Medium":
      return "priority priority-medium";
    default:
      return "priority priority-low";
  }
}

export default function AllTasks() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState(MOCK_TASKS);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.project.toLowerCase().includes(search.toLowerCase()) ||
        t.assignee.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const overdue = tasks.filter((t) => t.status === "Overdue").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    return { total, inProgress, overdue, completed };
  }, [tasks]);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [{ ...newTask, id: prev.length + 1 }, ...prev]);
    setShowModal(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="tasks-page">
          <div className="tasks-header">
            <div>
              <h1>All Tasks</h1>
              <p className="subtext">Every task across all divisions — Tuesday, 30 June</p>
            </div>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              + New Task
            </button>
          </div>

          {/* Stat cards */}
          <div className="stats-row">
            <div className="stat-card">
              <p className="stat-label">TOTAL TASKS</p>
              <h2 className="stat-value">{stats.total}</h2>
              <p className="stat-sub">across all projects</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">IN PROGRESS</p>
              <h2 className="stat-value blue">{stats.inProgress}</h2>
              <p className="stat-sub">being worked on</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">OVERDUE</p>
              <h2 className="stat-value red">{stats.overdue}</h2>
              <p className="stat-sub">needs action</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">COMPLETED</p>
              <h2 className="stat-value green">{stats.completed}</h2>
              <p className="stat-sub">this month</p>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <input
              type="text"
              placeholder="Search tasks, projects, people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <div className="status-filters">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  className={`filter-chip ${statusFilter === s ? "active" : ""}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="tasks-table-card">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Progress</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((t) => (
                  <tr key={t.id}>
                    <td className="task-title">{t.title}</td>
                    <td className="task-project">{t.project}</td>
                    <td>
                      <div className="assignee-cell">
                        <span
                          className="avatar"
                          style={{ backgroundColor: t.color }}
                        >
                          {t.initials}
                        </span>
                        {t.assignee}
                      </div>
                    </td>
                    <td>
                      <span className={priorityClass(t.priority)}>{t.priority}</span>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${t.progress}%` }}
                          />
                        </div>
                        <span className="progress-label">{t.progress}%</span>
                      </div>
                    </td>
                    <td className="task-deadline">{t.deadline}</td>
                    <td>
                      <span className={statusClass(t.status)}>{t.status}</span>
                    </td>
                  </tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty-row">
                      No tasks match your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <NewTaskModal onClose={() => setShowModal(false)} onSave={handleAddTask} />
      )}
    </div>
  );
}

function NewTaskModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    project: "",
    assignee: "",
    initials: "",
    color: "#2563eb",
    priority: "Medium",
    progress: 0,
    deadline: "",
    status: "In Progress",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.project || !form.assignee) return;
    const initials = form.assignee
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    onSave({ ...form, initials, progress: Number(form.progress) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Task</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Task title
            <input
              type="text"
              placeholder="e.g. Configure SIEM alert rules"
              value={form.title}
              onChange={handleChange("title")}
              required
            />
          </label>

          <label>
            Project
            <input
              type="text"
              placeholder="e.g. SOC Playbook Automation"
              value={form.project}
              onChange={handleChange("project")}
              required
            />
          </label>

          <label>
            Assignee
            <input
              type="text"
              placeholder="e.g. Ahmed Raza"
              value={form.assignee}
              onChange={handleChange("assignee")}
              required
            />
          </label>

          <div className="modal-row">
            <label>
              Priority
              <select value={form.priority} onChange={handleChange("priority")}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <label>
              Deadline
              <input
                type="text"
                placeholder="e.g. 20 Jul"
                value={form.deadline}
                onChange={handleChange("deadline")}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
