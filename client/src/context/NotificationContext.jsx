import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";
import { useToast } from "./ToastContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const knownIds = useRef(new Set()); // tracks which notification IDs we've already seen
  const isFirstLoad = useRef(true);

  const fetchNotifications = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.get("/notifications");
      const fetched = res.data;

      if (isFirstLoad.current) {
        // First load after login/page open - just record what exists, don't toast for old stuff
        fetched.forEach((n) => knownIds.current.add(n._id));
        isFirstLoad.current = false;
      } else {
        // Every load after that - anything with an ID we haven't seen before is NEW
        const newOnes = fetched.filter((n) => !knownIds.current.has(n._id));
   newOnes.forEach((n) => {
  showToast("New notification arrived", "success", 5000);
  knownIds.current.add(n._id);
});
      }

      setNotifications(fetched);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchNotifications(); // run once immediately
    const interval = setInterval(fetchNotifications, 20000); // then every 20 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, loading, unreadCount, markAsRead, markAllRead, refetch: fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}