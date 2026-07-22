import { useEffect } from "react";
import InternSidebar from "../../components/InternSidebar";
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

export default function InternNotifications() {
  const { notifications, loading, markAsRead, markAllRead, refetch } = useNotifications();

  useEffect(() => {
    refetch(); // grab anything new since the app first loaded
  }, [refetch]);

  const filter = "All"; // kept simple - extend below if you still want the All/Unread toggle

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

        <div className="notif-list-card">
          {loading ? (
            <div className="empty-state">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="empty-state">No notifications to show.</div>
          ) : (
            notifications.map((n) => (
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