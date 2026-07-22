import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useNotifications } from "../../context/NotificationContext";
import "../../assets/styles.css";

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

export default function Notifications() {
  const { notifications, loading, unreadCount, markAsRead, markAllRead, refetch } = useNotifications();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const visible = showUnreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

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
            <button className="btn-secondary" onClick={markAllRead}>
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
            {loading && <div className="empty-state">Loading...</div>}

            {!loading && visible.length === 0 && (
              <div className="empty-state">No notifications here.</div>
            )}

            {!loading &&
              visible.map((n) => (
                <div
                  key={n._id}
                  className={`notif-row ${n.read ? "" : "unread"}`}
                  onClick={() => markAsRead(n._id)}
                >
                  <div className="notif-body">
                    <div className="notif-top">
                      <p className="notif-title">{n.title}</p>
                      {!n.read && <span className="dot" />}
                    </div>
                    <p className="notif-message">{n.message}</p>
                    <p className="notif-meta">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}