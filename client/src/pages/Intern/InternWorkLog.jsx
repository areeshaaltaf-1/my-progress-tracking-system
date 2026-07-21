import { useState, useEffect } from "react";
import InternSidebar from "../../components/InternSidebar";
import api from "../../api/axios";
import "../../assets/styles.css";
import { useToast } from "../../context/ToastContext";

function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user"));
  } catch {
    return null;
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function InternWorkLog() {
  const currentUser = getCurrentUser();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [taskId, setTaskId] = useState("");
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");

  const fetchData = async () => {
    try {
      const [taskRes, logRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/worklogs"),
      ]);

      const myTasks = taskRes.data.filter((t) => t.assignedTo?._id === currentUser?.id);
      setTasks(myTasks);
      if (myTasks.length && !taskId) setTaskId(myTasks[0]._id);

      setLogs(logRes.data);
    } catch (err) {
      console.error("Failed to fetch work log data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddLog = async () => {
    if (!taskId || !hours || !note.trim()) return;

    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) return;

    setSaving(true);
    try {
      await api.post("/worklogs", {
        task: taskId,
        hours: hoursNum,
        note: note.trim(),
      });
      setHours("");
      setNote("");
      await fetchData();
      showToast("Entry added successfully");
    } catch (err) {
      console.error("Failed to add log entry", err);
      alert(err.response?.data?.message || "Failed to add entry");
    } finally {
      setSaving(false);
    }
  };

  const groupedByDate = logs.reduce((acc, log) => {
    const label = formatDate(log.date);
    if (!acc[label]) acc[label] = [];
    acc[label].push(log);
    return acc;
  }, {});

  const totalHours = logs.reduce((a, l) => a + l.hours, 0);
  const todayLabel = formatDate(new Date());
  const todayHours = logs
    .filter((l) => formatDate(l.date) === todayLabel)
    .reduce((a, l) => a + l.hours, 0);

  if (loading) {
    return (
      <div className="smp-layout it-page">
        <InternSidebar />
        <main className="smp-main it-main">
          <p>Loading work log...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="smp-layout it-page">
      <InternSidebar />

      <main className="smp-main it-main">
        <h1 className="it-title">Work Log</h1>
        <p className="it-subtitle">Log the time and notes for what you worked on each day</p>

        <div className="it-stats it-stats-2">
          <div className="it-stat-card">
            <span className="it-stat-label">TOTAL LOGGED</span>
            <span className="it-stat-value">{totalHours}h</span>
            <span className="it-stat-sub">{logs.length} entries</span>
          </div>
          <div className="it-stat-card">
            <span className="it-stat-label yellow">TODAY</span>
            <span className="it-stat-value yellow">{todayHours}h</span>
            <span className="it-stat-sub">most recent entries</span>
          </div>
        </div>

        <div className="wl-form-card">
          {tasks.length === 0 ? (
            <p className="it-subtitle">You have no assigned tasks to log time against yet.</p>
          ) : (
            <div className="wl-form-grid">
              <div className="wl-form-columns">
                <div className="wl-form-left">
                  <div className="wl-field">
                    <label>Task</label>
                    <select value={taskId} onChange={(e) => setTaskId(e.target.value)}>
                      {tasks.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.title}
                          {t.project?.projectName ? ` — ${t.project.projectName}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="wl-field">
                    <label>Hours</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="e.g. 2.5"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                    />
                  </div>
                </div>

                <div className="wl-form-right">
                  <div className="wl-field wl-field-note">
                    <label>What did you work on?</label>
                    <textarea
                      placeholder="Briefly describe what you did..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="wl-add-btn-row">
                <button
                  className="btn-primary wl-add-btn"
                  onClick={handleAddLog}
                  disabled={saving}
                >
                  {saving ? "Adding..." : "Add Entry"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="wl-log-list">
          {Object.keys(groupedByDate).length === 0 ? (
            <div className="smp-empty">No log entries yet.</div>
          ) : (
            Object.entries(groupedByDate).map(([date, entries]) => (
              <div key={date} className="wl-day-group">
                <p className="wl-day-label">{date}</p>
                {entries.map((entry) => (
                  <div key={entry._id} className="wl-entry-card">
                    <div className="wl-entry-top">
                      <h4 className="wl-entry-task">
                        {entry.task?.title}
                        {entry.task?.project?.projectName ? ` — ${entry.task.project.projectName}` : ""}
                      </h4>
                      <span className="wl-entry-hours">{entry.hours}h</span>
                    </div>
                    <p className="wl-entry-note">{entry.note}</p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}