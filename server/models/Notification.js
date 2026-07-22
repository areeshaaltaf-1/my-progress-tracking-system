const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "task_assigned",
        "task_overdue",
        "task_deadline_approaching",
        "task_status_changed", // covers "moved to review", "completed", "approved"
        "task_progress_updated",
        "project_created",
        "worklog_added",
        "project_completed",
      ],
      required: true,
    },
    title: { type: String, required: true },     // e.g. "New task assigned"
    message: { type: String, required: true },   // e.g. "You were assigned 'Write detection rules...' by Ahmed Raza"
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);