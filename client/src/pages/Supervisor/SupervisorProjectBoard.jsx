import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SupervisorSidebar from "../../components/SupervisorSidebar";
import { projectsData, COLUMNS } from "../../data/ProjectsData";
import "../../assets/styles.css";

function statusClass(status) {
  if (status === "Completed") return "task-status status-completed";
  if (status === "Awaiting review") return "task-status status-review";
  return "task-status status-notstarted";
}

export default function SupervisorProjectBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const project = projectsData.find((p) => p.id === Number(projectId));

  const [tasks, setTasks] = useState(project ? project.tasks : []);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTasks(project ? project.tasks : []);
  }, [projectId]);

  if (!project) {
    return (
      <div className="supervisor-layout">
        <SupervisorSidebar />
        <div className="sv-main-content">
          <p>Project not found.</p>
          <button
            className="btn-primary"
            onClick={() => navigate("/supervisor/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const grouped = useMemo(() => {
    const map = {};
    COLUMNS.forEach((c) => (map[c.key] = []));
    tasks.forEach((t) => map[t.column]?.push(t));
    return map;
  }, [tasks]);

  const handleAssign = (newTask) => {
    setTasks((prev) => [...prev, { ...newTask, id: prev.length + 1 }]);
    setShowModal(false);
  };

  return (
    <div className="supervisor-layout">
      <SupervisorSidebar />

      <div className="sv-main-content">
        <div className="sv-breadcrumb">PROJECTS / {project.name}</div>

        <div className="project-header-card">
          <div className="project-header-top">
            <div>
              <h1>{project.name}</h1>
              <p className="project-desc">
                {project.description} · Deadline {project.deadline}
              </p>
            </div>
            <div className="project-progress-block">
              <button
                className="btn-primary"
                style={{ marginBottom: "12px" }}
                onClick={() => setShowModal(true)}
              >
                + Assign Task
              </button>
              <span className="project-progress-value">{project.progress}%</span>
              <span className="project-progress-label">overall progress</span>
            </div>
          </div>

          <div className="project-meta-row">
            <div className="meta-tags">
              <span className="meta-tag">{tasks.length} tasks</span>
              <span className="meta-tag">{project.contributors} contributors</span>
              <span className="meta-tag">Priority: {project.priority}</span>
            </div>
            <div className="avatar-stack">
              {project.team.map((m, i) => (
                <span
                  key={i}
                  className="stack-avatar"
                  style={{ backgroundColor: m.color }}
                >
                  {m.initials}
                </span>
              ))}
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
                  <div className="task-card" key={t.id}>
                    <p className="task-title">{t.title}</p>

                    {typeof t.progress === "number" && (
                      <div className="task-progress-track">
                        <div
                          className="task-progress-fill"
                          style={{
                            width: `${t.progress}%`,
                            backgroundColor: t.progress >= 50 ? "#10b981" : "#f59e0b",
                          }}
                        />
                      </div>
                    )}

                    <div className="task-card-footer">
                      <div className="task-card-left">
                        {t.status && (
                          <span className={statusClass(t.status)}>
                            <span className="status-dot" />
                            {t.status}
                          </span>
                        )}
                        {typeof t.progress === "number" && (
                          <span className="task-progress-text">
                            {t.progress}%{t.due ? ` · due ${t.due}` : ""}
                          </span>
                        )}
                        {!t.status && typeof t.progress !== "number" && t.due && (
                          <span className="task-due">due {t.due}</span>
                        )}
                      </div>
                      <span
                        className="card-avatar"
                        style={{ backgroundColor: t.assignee.color }}
                      >
                        {t.assignee.initials}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <AssignTaskModal onClose={() => setShowModal(false)} onSave={handleAssign} />
      )}
    </div>
  );
}

function AssignTaskModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    column: "To Do",
    assigneeName: "",
    due: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.assigneeName) return;
    const initials = form.assigneeName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    onSave({
      title: form.title,
      column: form.column,
      due: form.due || undefined,
      status: form.column === "To Do" ? "Not started" : undefined,
      assignee: { initials, color: "#2563eb" },
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Assign Task</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
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
            Assign to
            <input
              type="text"
              placeholder="e.g. Hina Malik"
              value={form.assigneeName}
              onChange={handleChange("assigneeName")}
              required
            />
          </label>

          <div className="modal-row">
            <label>
              Column
              <select value={form.column} onChange={handleChange("column")}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Review</option>
                <option>Done</option>
              </select>
            </label>

            <label>
              Due date
              <input
                type="text"
                placeholder="e.g. 20 Jul"
                value={form.due}
                onChange={handleChange("due")}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}