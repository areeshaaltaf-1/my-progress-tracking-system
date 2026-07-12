import { useState } from "react";
import InternSidebar from "../../components/InternSidebar";
import "../../assets/styles.css";

const initialNotifications = [
  {
    id: 1,
    title: "Task flagged as overdue",
    message: "'Close firewall gaps list' is now 2 days overdue. Bilal Khan has been notified.",
    time: "10 minutes ago",
    unread: true,
  },
  {
    id: 2,
    title: "Feedback on your task",
    message: "Ahmed Raza left a comment on 'Automate phishing-report triage playbook'.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "New task assigned",
    message: "You were assigned 'Write detection rules for lateral movement' by Ahmed Raza.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    title: "Task approved",
    message: "'Define playbook taxonomy & tagging' was marked as completed.",
    time: "2 days ago",
    unread: false,
  },
];

export default function InternNotifications() {
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
    <div className="smp-layout it-page">
      <InternSidebar />

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