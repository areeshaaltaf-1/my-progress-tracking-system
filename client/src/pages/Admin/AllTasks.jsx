import { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../assets/styles.css";
import api from "../../api/axios";

const STATUS_FILTERS = ["All", "Pending", "In Progress", "Overdue", "Completed"];

function statusClass(status) {
  switch (status) {
    case "Completed":
      return "badge badge-completed";
    case "Overdue":
      return "badge badge-overdue";
    case "Pending":
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
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignees, setAssignees] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const fetchAssignees = async () => {
    try {
      const res = await api.get("/users");
      setAssignees(res.data.filter((u) => u.role === "Supervisor"));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchAssignees();
  }, []);

  // Compute a display status: Overdue overrides In Progress/Pending if deadline has passed
  const withDisplayStatus = (t) => {
    const today = new Date();
    if (t.status !== "Completed" && t.deadline && new Date(t.deadline) < today) {
      return { ...t, displayStatus: "Overdue" };
    }
    return { ...t, displayStatus: t.status };
  };

  const enrichedTasks = useMemo(() => tasks.map(withDisplayStatus), [tasks]);

  const filteredTasks = useMemo(() => {
    return enrichedTasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.project?.projectName || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.assignedTo?.name || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || t.displayStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enrichedTasks, search, statusFilter]);

  const stats = useMemo(() => {
    const total = enrichedTasks.length;
    const inProgress = enrichedTasks.filter((t) => t.displayStatus === "In Progress").length;
    const overdue = enrichedTasks.filter((t) => t.displayStatus === "Overdue").length;
    const completed = enrichedTasks.filter((t) => t.displayStatus === "Completed").length;
    return { total, inProgress, overdue, completed };
  }, [enrichedTasks]);

  const handleAddTask = async (newTask) => {
    try {
      await api.post("/tasks", newTask);
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task", err);
    }
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
              <p className="subtext">Every task across all divisions</p>
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
                  <tr key={t._id}>
                    <td className="task-title">{t.title}</td>
                    <td className="task-project">{t.project?.projectName || "—"}</td>
                    <td>
                      <div className="assignee-cell">
                        <span className="avatar" style={{ backgroundColor: "#2563eb" }}>
                          {t.assignedTo?.name?.[0]?.toUpperCase() || "?"}
                        </span>
                        {t.assignedTo?.name || "Unassigned"}
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
                            style={{ width: `${t.progress || 0}%` }}
                          />
                        </div>
                        <span className="progress-label">
                          {t.progress ? `${t.progress}%` : "—"}
                        </span>
                      </div>
                    </td>
                    <td className="task-deadline">
                      {t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}
                    </td>
                    <td>
                      <span className={statusClass(t.displayStatus)}>{t.displayStatus}</span>
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
        <NewTaskModal
          projects={projects}
          assignees={assignees}
          onClose={() => setShowModal(false)}
          onSave={handleAddTask}
        />
      )}
    </div>
  );
}

function NewTaskModal({ projects, assignees, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    priority: "Medium",
    deadline: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.project || !form.assignedTo) return;
    onSave(form);
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
            <select value={form.project} onChange={handleChange("project")} required>
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Assignee
            <select value={form.assignedTo} onChange={handleChange("assignedTo")} required>
              <option value="">Select assignee</option>
              {assignees.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} ({a.role})
                </option>
              ))}
            </select>
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
                type="date"
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