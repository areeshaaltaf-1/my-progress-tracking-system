import { useState } from "react";
import SupervisorSidebar from "../../components/SupervisorSidebar";
import "../../assets/styles.css";

const initialNotifications = [
  {
    id: 1,
    title: "Task moved to Review",
    message: "Hamza Malik moved 'Runbook: Credential dump response' to Review.",
    time: "10 minutes ago",
    unread: true,
  },
  {
    id: 2,
    title: "New comment on SOC Playbook Automation",
    message: "Bilal Khan commented on the phishing-report triage playbook task.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Deadline approaching",
    message: "'Draft escalation matrix v2' is due in 2 days.",
    time: "3 hours ago",
    unread: true,
  },
  {
    id: 4,
    title: "Task completed",
    message: "Zara Farooq marked 'Define playbook taxonomy & tagging' as Done.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 5,
    title: "New team member assigned",
    message: "Noor Siddiqui was added to Vulnerability Management Pipeline.",
    time: "2 days ago",
    unread: false,
  },
];

export default function SupervisorNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const filtered = notifications.filter((n) =>
    filter === "Unread" ? n.unread : true
  );

  return (
    <div className="smp-layout">
      <SupervisorSidebar />

      <main className="smp-main notifications-page">
        <div className="notifications-header">
          <h1>Notifications</h1>
          <button className="btn-secondary" onClick={markAllRead}>
            Mark all as read
          </button>
        </div>

        <div className="notif-filters">
          <button
            className={`filter-chip ${filter === "All" ? "active" : ""}`}
            onClick={() => setFilter("All")}
          >
            All
          </button>
          <button
            className={`filter-chip ${filter === "Unread" ? "active" : ""}`}
            onClick={() => setFilter("Unread")}
          >
            Unread ({notifications.filter((n) => n.unread).length})
          </button>
        </div>

        <div className="notif-list-card">
          {filtered.length === 0 ? (
            <div className="empty-state">No notifications to show.</div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`notif-row ${n.unread ? "unread" : ""}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className="notif-top">
                  {n.unread && <span className="dot" />}
                  <h4 className="notif-title">{n.title}</h4>
                </div>
                <p className="notif-message">{n.message}</p>
                <p className="notif-meta">{n.time}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}