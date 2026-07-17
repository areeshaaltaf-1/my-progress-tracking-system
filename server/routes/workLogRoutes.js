const express = require("express");
const router = express.Router();
const WorkLog = require("../models/WorkLog");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

// Create a work log entry (Internee only — task must be assigned to them)
router.post("/", authMiddleware, roleMiddleware(["Internee"]), async (req, res) => {
  try {
    const { task, hours, note } = req.body;

    if (!task || !hours || !note) {
      return res.status(400).json({ message: "Task, hours and note are required" });
    }

    const taskDoc = await Task.findById(task);
    if (!taskDoc) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (!taskDoc.assignedTo || taskDoc.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only log time against your own tasks" });
    }

    if (hours <= 0 || hours > 24) {
      return res.status(400).json({ message: "Hours must be between 0 and 24" });
    }

    const entry = await WorkLog.create({
      task,
      user: req.user.id,
      hours,
      note: note.trim(),
    });

    const populated = await entry.populate({
      path: "task",
      select: "title project",
      populate: { path: "project", select: "projectName" },
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get the logged-in intern's own entries, newest first
router.get("/", authMiddleware, roleMiddleware(["Internee"]), async (req, res) => {
  try {
    const logs = await WorkLog.find({ user: req.user.id })
      .populate({
        path: "task",
        select: "title project",
        populate: { path: "project", select: "projectName" },
      })
      .sort({ date: -1 });

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json(err);
  }
});
const Project = require("../models/Project");

// Get all work log entries for a project's tasks (Admin, or the Supervisor who owns the project)
router.get(
  "/project/:projectId",
  authMiddleware,
  roleMiddleware(["Admin", "Supervisor"]),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      if (!project) return res.status(404).json({ message: "Project not found" });

      if (
        req.user.role === "Supervisor" &&
        (!project.supervisor || project.supervisor.toString() !== req.user.id)
      ) {
        return res.status(403).json({ message: "You can only view logs for your own projects" });
      }

      const projectTasks = await Task.find({ project: req.params.projectId }).select("_id");
      const taskIds = projectTasks.map((t) => t._id);

      const logs = await WorkLog.find({ task: { $in: taskIds } })
        .populate({ path: "task", select: "title" })
        .populate({ path: "user", select: "name" })
        .sort({ date: -1 });

      res.status(200).json(logs);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = router;