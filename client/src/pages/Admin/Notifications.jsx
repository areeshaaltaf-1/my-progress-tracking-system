import { useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../assets/styles.css";

// ---- Mock data (swap for API data once Express/Mongo is connected) ----
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Task deadline approaching",
    message: "\"Harden firewall rule set\" is due in 2 days.",
    time: "10 min ago",
    read: false,
  },
  {
    id: 2,
    title: "Task marked complete",
    message: "Ahmed Raza completed \"Publish dashboard widgets v2\".",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "Task overdue",
    message: "\"Configure SIEM alert rules\" passed its deadline.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: 4,
    title: "New task assigned",
    message: "You assigned \"Draft phishing email templates\" to Zara Fatima.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    title: "Progress updated",
    message: "Bilal Khan updated progress to 20% on \"Harden firewall rule set\".",
    time: "Yesterday",
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const visible = showUnreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="notifications-page">
          <div className="notifications-header">
            <div>
              <h1>Notifications</h1>
              <p className="subtext">
                {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
              </p>
            </div>
            <button className="btn-secondary" onClick={markAllAsRead}>
              Mark all as read
            </button>
          </div>

          <div className="notif-filters">
            <button
              className={`filter-chip ${!showUnreadOnly ? "active" : ""}`}
              onClick={() => setShowUnreadOnly(false)}
            >
              All
            </button>
            <button
              className={`filter-chip ${showUnreadOnly ? "active" : ""}`}
              onClick={() => setShowUnreadOnly(true)}
            >
              Unread
            </button>
          </div>

          <div className="notif-list-card">
            {visible.length === 0 && (
              <div className="empty-state">No notifications here.</div>
            )}

            {visible.map((n) => (
              <div
                key={n.id}
                className={`notif-row ${n.read ? "" : "unread"}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className="notif-body">
                  <div className="notif-top">
                    <p className="notif-title">{n.title}</p>
                    {!n.read && <span className="dot" />}
                  </div>
                  <p className="notif-message">{n.message}</p>
                  <p className="notif-meta">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
