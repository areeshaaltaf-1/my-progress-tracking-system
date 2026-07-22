import { useState, useEffect } from "react";
import InternSidebar from "../../components/InternSidebar";
import api from "../../api/axios";
import "../../assets/styles.css";

// Converts a timestamp into "10 minutes ago", "Yesterday", etc.
function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default function InternNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.put("/notifications/mark-all-read");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const filtered = notifications.filter((n) =>
    filter === "Unread" ? !n.read : true
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
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
        </div>

        <div className="notif-list-card">
          {loading ? (
            <div className="empty-state">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No notifications to show.</div>
          ) : (
            filtered.map((n) => (
              <div
                key={n._id}
                className={`notif-row ${!n.read ? "unread" : ""}`}
                onClick={() => markAsRead(n._id)}
              >
                <div className="notif-top">
                  {!n.read && <span className="dot" />}
                  <h4 className="notif-title">{n.title}</h4>
                </div>
                <p className="notif-message">{n.message}</p>
                <p className="notif-meta">{timeAgo(n.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}