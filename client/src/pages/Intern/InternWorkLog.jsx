import { useState } from "react";
import InternSidebar from "../../components/InternSidebar";
import "../../assets/styles.css";

const initialLogs = [
  {
    id: 1,
    date: "11 Jul 2026",
    task: "Automate phishing-report triage playbook",
    hours: 3.5,
    note: "Built the initial trigger logic and connected it to the ticket queue. Still need to test edge cases for malformed headers.",
  },
  {
    id: 2,
    date: "11 Jul 2026",
    task: "Write detection rules for lateral movement",
    hours: 1,
    note: "Read through past incident reports to identify common lateral movement patterns before writing rules.",
  },
  {
    id: 3,
    date: "10 Jul 2026",
    task: "Close firewall gaps list — Network Hardening",
    hours: 2,
    note: "Cross-checked current firewall rules against the audit list. Found 4 gaps, flagged to Bilal for review.",
  },
  {
    id: 4,
    date: "09 Jul 2026",
    task: "Define playbook taxonomy & tagging",
    hours: 4,
    note: "Finalized tag categories and applied them across all existing playbooks. Marked as completed.",
  },
];

const taskOptions = [
  "Close firewall gaps list — Network Hardening",
  "Automate phishing-report triage playbook",
  "Write detection rules for lateral movement",
  "Define playbook taxonomy & tagging",
];

export default function InternWorkLog() {
  const [logs, setLogs] = useState(initialLogs);
  const [task, setTask] = useState(taskOptions[0]);
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");

  const handleAddLog = () => {
    if (!hours || !note.trim()) return;

    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      task,
      hours: parseFloat(hours),
      note: note.trim(),
    };

    setLogs([newLog, ...logs]);
    setHours("");
    setNote("");
  };

  const groupedByDate = logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});

  const totalHours = logs.reduce((a, l) => a + l.hours, 0);
  const todayHours = logs
    .filter((l) => l.date === logs[0]?.date)
    .reduce((a, l) => a + l.hours, 0);

  return (
    <div className="smp-layout it-page">
      <InternSidebar />

      <main className="smp-main it-main">
        <h1 className="it-title">Work Log</h1>
        <p className="it-subtitle">Log the time and notes for what you worked on each day</p>

        <div className="it-stats">
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
          <div className="wl-form-row">
            <div className="wl-field">
              <label>Task</label>
              <select value={task} onChange={(e) => setTask(e.target.value)}>
                {taskOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="wl-field wl-field-hours">
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

          <div className="wl-field">
            <label>What did you work on?</label>
            <textarea
              rows={3}
              placeholder="Briefly describe what you did..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleAddLog}>
            Add Entry
          </button>
        </div>

        <div className="wl-log-list">
          {Object.keys(groupedByDate).length === 0 ? (
            <div className="smp-empty">No log entries yet.</div>
          ) : (
            Object.entries(groupedByDate).map(([date, entries]) => (
              <div key={date} className="wl-day-group">
                <p className="wl-day-label">{date}</p>
                {entries.map((entry) => (
                  <div key={entry.id} className="wl-entry-card">
                    <div className="wl-entry-top">
                      <h4 className="wl-entry-task">{entry.task}</h4>
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