import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InternSidebar from "../../components/InternSidebar";
import api from "../../api/axios";
import "../../assets/styles.css";

const STATUS_STYLES = {
  Overdue: "it-badge overdue",
  "In Progress": "it-badge progress",
  Pending: "it-badge notstarted",
  Completed: "it-badge completed",
};

function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user"));
  } catch {
    return null;
  }
}

function displayStatus(task) {
  // "Overdue" isn't a real backend status — it's Pending/In Progress past deadline
  if (
    task.status !== "Completed" &&
    task.deadline &&
    new Date(task.deadline) < new Date()
  ) {
    return "Overdue";
  }
  return task.status;
}

export default function InternTasks() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const currentUser = getCurrentUser();

  const fetchTasks = async () => {
    try {
      const res = await api.get(projectId ? `/tasks?project=${projectId}` : "/tasks");
      const mine = res.data.filter((t) => t.assignedTo?._id === currentUser?._id);
      setTasks(mine);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleStart = async (taskId) => {
    setUpdatingId(taskId);
    try {
      await api.put(`/tasks/${taskId}`, { status: "In Progress", progress: 10 });
      await fetchTasks();
    } catch (err) {
      console.error("Failed to start task", err);
      alert(err.response?.data?.message || "Failed to update task");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleComplete = async (taskId) => {
    setUpdatingId(taskId);
    try {
      await api.put(`/tasks/${taskId}`, { status: "Completed", progress: 100 });
      await fetchTasks();
    } catch (err) {
      console.error("Failed to complete task", err);
      alert(err.response?.data?.message || "Failed to update task");
    } finally {
      setUpdatingId(null);
    }
  };

  const filters = ["All", "This week", "Overdue"];

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" || (filter === "Overdue" ? displayStatus(t) === "Overdue" : true);
    return matchSearch && matchFilter;
  });

  const assigned = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const overdue = tasks.filter((t) => displayStatus(t) === "Overdue").length;
  const avgProgress = tasks.length
    ? Math.round(tasks.reduce((a, t) => a + (t.progress || 0), 0) / tasks.length)
    : 0;

  if (loading) {
    return (
      <div className="smp-layout">
        <InternSidebar />
        <main className="smp-main it-main">
          <p>Loading tasks...</p>
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

        <h1 className="it-title">My Tasks</h1>
        <p className="it-subtitle">Everything assigned to you, sorted by deadline</p>

        <div className="it-stats">
          <div className="it-stat-card">
            <span className="it-stat-label">ASSIGNED</span>
            <span className="it-stat-value">{assigned}</span>
            <span className="it-stat-sub">total tasks</span>
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
            {filtered.map((task) => {
              const status = displayStatus(task);
              return (
                <div
                  key={task._id}
                  className={`it-task-row ${status === "Overdue" ? "overdue" : ""} ${
                    task.status === "Completed" ? "completed" : ""
                  }`}
                >
                  <div className="it-task-top">
                    <div>
                      <h3 className="it-task-title">{task.title}</h3>
                      <p className="it-task-supervisor">
                        {task.project?.projectName || ""}
                      </p>
                    </div>
                    <span className={STATUS_STYLES[status]}>
                      <span className="it-badge-dot" />
                      {status}
                    </span>
                  </div>

                  <div className="it-progress-track">
                    <div
                      className="it-progress-fill"
                      style={{
                        width: `${task.progress || 0}%`,
                        background:
                          status === "Overdue"
                            ? "#ef4444"
                            : task.status === "Completed"
                            ? "#22c55e"
                            : "#10b981",
                      }}
                    />
                  </div>

                  <div className="it-task-footer">
                    <span>{task.progress || 0}%</span>
                    <span>
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                    </span>
                  </div>

                  {task.status !== "Completed" && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      {task.status === "Pending" && (
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, padding: "6px 0", fontSize: "0.8rem" }}
                          disabled={updatingId === task._id}
                          onClick={() => handleStart(task._id)}
                        >
                          {updatingId === task._id ? "Starting..." : "Start Task"}
                        </button>
                      )}
                      <button
                        className="btn-primary"
                        style={{ flex: 1, padding: "6px 0", fontSize: "0.8rem" }}
                        disabled={updatingId === task._id}
                        onClick={() => handleComplete(task._id)}
                      >
                        {updatingId === task._id ? "Saving..." : "Mark Complete"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}