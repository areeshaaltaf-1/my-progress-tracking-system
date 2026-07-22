const Notification = require("../models/Notification");

const notify = async ({ recipient, type, title, message, relatedTask, relatedProject, triggeredBy }) => {
  try {
    if (!recipient) return; // safety check - don't crash if there's no one to notify
    await Notification.create({
      recipient,
      type,
      title,
      message,
      relatedTask,
      relatedProject,
      triggeredBy,
    });
  } catch (err) {
    console.error("Notification creation failed:", err.message);
  }
};

module.exports = notify;