import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SupervisorSidebar from "../../components/SupervisorSidebar";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import "../../assets/styles.css";

const COLUMNS = [
  { key: "Pending", label: "Pending", accent: "#f59e0b" },
  { key: "In Progress", label: "In Progress", accent: "#3b82f6" },
  { key: "Completed", label: "Completed", accent: "#10b981" },
];

function statusClass(status) {
  if (status === "Completed") return "task-status status-completed";
  if (status === "In Progress") return "task-status status-review";
  return "task-status status-notstarted";
}

export default function SupervisorProjectBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [interns, setInterns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [workLogs, setWorkLogs] = useState([]);
  const [viewingLogsFor, setViewingLogsFor] = useState(null);
  const fetchWorkLogs = async () => {
  try {
    const res = await api.get(`/worklogs/project/${projectId}`);
    setWorkLogs(res.data);
  } catch (err) {
    console.error("Failed to fetch work logs", err);
  }
};

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      setProject(res.data);
    } catch (err) {
      console.error("Failed to fetch project", err);
      setNotFound(true);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?project=${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const fetchInterns = async () => {
    try {
      const res = await api.get("/users");
      setInterns(res.data.filter((u) => u.role?.toLowerCase() === "internee"));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
  setLoading(true);
  setNotFound(false);
  Promise.all([fetchProject(), fetchTasks(), fetchInterns(), fetchWorkLogs()]).finally(() =>
    setLoading(false)
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [projectId]);

  const grouped = useMemo(() => {
    const map = {};
    COLUMNS.forEach((c) => (map[c.key] = []));
    tasks.forEach((t) => map[t.status]?.push(t));
    return map;
  }, [tasks]);
  const hoursByTask = useMemo(() => {
  const map = {};
  workLogs.forEach((log) => {
    const id = log.task?._id;
    if (!id) return;
    map[id] = (map[id] || 0) + log.hours;
  });
  return map;
}, [workLogs]);
const logsForViewingTask = useMemo(() => {
  if (!viewingLogsFor) return [];
  return workLogs
    .filter((log) => log.task?._id === viewingLogsFor._id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}, [viewingLogsFor, workLogs]);

  const handleAssign = async (newTask) => {
    try {
      await api.post("/tasks", { ...newTask, project: projectId });
      setShowModal(false);
      fetchTasks();
      showToast("Task assigned successfully");
    } catch (err) {
      console.error("Failed to create task", err);
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleEditClick = (task) => setEditingTask(task);

  const handleEditSave = async (updatedFields) => {
    try {
      await api.put(`/tasks/${editingTask._id}`, updatedFields);
      setEditingTask(null);
      fetchTasks();
       showToast("Task updated successfully");
    } catch (err) {
      console.error("Failed to update task", err);
      alert(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteClick = async (taskId) => {
    if (!window.confirm("Delete this task? This can't be undone.")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
      showToast("Task deleted successfully");
    } catch (err) {
      console.error("Failed to delete task", err);
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="supervisor-layout">
        <SupervisorSidebar />
        <div className="sv-main-content">
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="supervisor-layout">
        <SupervisorSidebar />
        <div className="sv-main-content">
          <p>Project not found.</p>
          <button className="btn-primary" onClick={() => navigate("/supervisor/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progress =
  tasks.length === 0
    ? 0
    : Math.round(
        tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / tasks.length
      );
  return (
    <div className="supervisor-layout">
      <SupervisorSidebar />

      <div className="sv-main-content">
        <div className="sv-breadcrumb">PROJECTS / {project.projectName}</div>

        <div className="project-header-card">
          <div
  className="project-header-top"
  style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px" }}
>
  <div style={{ flex: 1, minWidth: 0 }}>
    <h1>{project.projectName}</h1>
    <p className="project-desc" style={{ fontSize: "1rem", lineHeight: 1.6 }}>
      {project.description}
      {project.endDate
        ? ` · Deadline ${new Date(project.endDate).toLocaleDateString()}`
        : ""}
    </p>
  </div>
  <div className="project-progress-block" style={{ flexShrink: 0 }}>
              <button
                className="btn-primary"
                style={{ marginBottom: "12px" }}
                onClick={() => setShowModal(true)}
              >
                + Assign Task
              </button>
              <span className="project-progress-value">{progress}%</span>
              <span className="project-progress-label">overall progress</span>
            </div>
          </div>

          <div className="project-meta-row">
            <div className="meta-tags">
              <span className="meta-tag">{tasks.length} tasks</span>
              <span className="meta-tag">Priority: {project.priority}</span>
              <span className="meta-tag">Status: {project.status}</span>
            </div>
          </div>
        </div>

        <p className="board-label">TASK BOARD</p>

        <div className="board-columns">
          {COLUMNS.map((col) => (
            <div className="board-column" key={col.key}>
              <div className="column-header" style={{ borderColor: col.accent }}>
                <span style={{ color: col.accent }}>{col.label}</span>
                <span className="column-count">{grouped[col.key].length}</span>
              </div>

              <div className="column-cards">
                {grouped[col.key].map((t) => (
                  <div
  className="task-card"
  key={t._id}
  onClick={() => setViewingLogsFor(t)}
  style={{ padding: "18px", minHeight: "180px", cursor: "pointer" }}
>
  <p className="task-title" style={{ fontSize: "1.05rem", marginBottom: "10px" }}>
    {t.title}
  </p>

  <div className="task-progress-track">
    <div
      className="task-progress-fill"
      style={{
        width: `${t.progress || 0}%`,
        backgroundColor: (t.progress || 0) >= 50 ? "#10b981" : "#f59e0b",
      }}
    />
  </div>

  <div className="task-card-footer" style={{ marginTop: "10px" }}>
    <div className="task-card-left">
      <span className={statusClass(t.status)} style={{ fontSize: "0.85rem" }}>
        <span className="status-dot" />
        {t.status}
      </span>
      <span className="task-progress-text" style={{ fontSize: "0.85rem" }}>
        {t.progress || 0}%
        {t.deadline ? ` · due ${new Date(t.deadline).toLocaleDateString()}` : ""}
        {hoursByTask[t._id] ? ` · ${hoursByTask[t._id]}h logged` : ""}
      </span>
    </div>
    <span className="card-avatar" style={{ backgroundColor: "#2563eb" }}>
      {t.assignedTo?.name?.[0]?.toUpperCase() || "?"}
    </span>
  </div>

  <div
    className="task-card-actions"
    style={{ display: "flex", gap: "8px", marginTop: "12px" }}
  >
    <button
      className="btn-secondary"
      style={{ flex: 1, padding: "7px 0", fontSize: "0.85rem" }}
      onClick={(e) => {
        e.stopPropagation();
        handleEditClick(t);
      }}
    >
      Edit
    </button>
    <button
      className="btn-danger"
      style={{ flex: 1, padding: "7px 0", fontSize: "0.85rem" }}
      onClick={(e) => {
        e.stopPropagation();
        handleDeleteClick(t._id);
      }}
    >
      Delete
    </button>
  </div>
</div>
                ))}
                {grouped[col.key].length === 0 && (
                  <p className="empty-row" style={{ fontSize: "0.85rem" }}>
                    No tasks here.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <AssignTaskModal
          interns={interns}
          onClose={() => setShowModal(false)}
          onSave={handleAssign}
        />
      )}

      {editingTask && (
        <AssignTaskModal
          interns={interns}
          initialValues={{
            title: editingTask.title,
            description: editingTask.description || "",
            assignedTo: editingTask.assignedTo?._id || "",
            priority: editingTask.priority,
            deadline: editingTask.deadline ? editingTask.deadline.slice(0, 10) : "",
          }}
          onClose={() => setEditingTask(null)}
          onSave={handleEditSave}
        />
      )}
      {viewingLogsFor && (
  <div className="modal-overlay" onClick={() => setViewingLogsFor(null)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>{viewingLogsFor.title}</h3>
        <button className="modal-close" onClick={() => setViewingLogsFor(null)}>
          &times;
        </button>
      </div>

      <div style={{ padding: "4px 0" }}>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "12px" }}>
          {hoursByTask[viewingLogsFor._id] || 0}h logged total ·{" "}
          {logsForViewingTask.length} entr{logsForViewingTask.length === 1 ? "y" : "ies"}
        </p>

        {logsForViewingTask.length === 0 ? (
          <p className="empty-row">No time logged on this task yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto" }}>
            {logsForViewingTask.map((log) => (
              <div
                key={log._id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "10px 12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                    {log.user?.name || "Unknown"}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#059669", fontWeight: 600 }}>
                    {log.hours}h
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "6px" }}>
                  {new Date(log.date).toLocaleDateString()}
                </p>
                <p style={{ fontSize: "0.85rem", color: "#374151" }}>{log.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
}

function AssignTaskModal({ interns, onClose, onSave, initialValues }) {
  const [form, setForm] = useState(
    initialValues || {
      title: "",
      description: "",
      assignedTo: "",
      priority: "Medium",
      deadline: "",
    }
  );

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.assignedTo) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialValues ? "Edit Task" : "Assign Task"}</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Task title
            <input
              type="text"
              placeholder="e.g. Write detection rules"
              value={form.title}
              onChange={handleChange("title")}
              required
            />
          </label>

          <label>
            Description
            <input
              type="text"
              placeholder="Optional details"
              value={form.description}
              onChange={handleChange("description")}
            />
          </label>

          <label>
            Assign to intern
            <select value={form.assignedTo} onChange={handleChange("assignedTo")} required>
              <option value="">Select intern</option>
              {interns.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
          </label>

          {interns.length === 0 && (
            <p style={{ fontSize: "0.8rem", color: "#dc2626" }}>
              No interns found. Ask admin to add intern accounts first.
            </p>
          )}

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
              <input type="date" value={form.deadline} onChange={handleChange("deadline")} />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialValues ? "Save Changes" : "Assign Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}