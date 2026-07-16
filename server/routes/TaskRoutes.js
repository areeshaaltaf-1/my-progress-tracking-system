const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

// Create task (Supervisor only — must own the project, assignee must be an Internee)
router.post("/", authMiddleware, roleMiddleware(["Supervisor"]), async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, deadline } = req.body;

    if (!title || !project || !assignedTo) {
      return res.status(400).json({ message: "Title, project and assignedTo are required" });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (!projectDoc.supervisor || projectDoc.supervisor.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only create tasks for your own projects" });
    }

    const assignee = await User.findById(assignedTo);
    if (!assignee || assignee.role?.toLowerCase() !== "internee") {
      return res.status(400).json({ message: "Tasks can only be assigned to interns" });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      priority,
      deadline,
    });

    const populated = await task.populate([
      { path: "project", select: "projectName" },
      { path: "assignedTo", select: "name" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get tasks — optional ?project=<id> filter. Open to any logged-in user.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;

    const tasks = await Task.find(filter).populate([
      { path: "project", select: "projectName" },
      { path: "assignedTo", select: "name" },
    ]);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get single task
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate([
      { path: "project", select: "projectName" },
      { path: "assignedTo", select: "name" },
    ]);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update task
// - Admin: can update any task, any field
// - Supervisor: can update any field, but only on tasks in projects they own
// - Internee: can ONLY update status/progress, and ONLY on tasks assigned to them
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["Admin", "Supervisor", "Internee"]),
  async (req, res) => {
    try {
      const existing = await Task.findById(req.params.id).populate("project");
      if (!existing) return res.status(404).json({ message: "Task not found" });

      let updateFields;

      if (req.user.role === "Internee") {
        if (!existing.assignedTo || existing.assignedTo.toString() !== req.user.id) {
          return res.status(403).json({ message: "You can only update tasks assigned to you" });
        }

        const { status, progress } = req.body;
        updateFields = {};
        if (status !== undefined) updateFields.status = status;
        if (progress !== undefined) updateFields.progress = progress;

        if (Object.keys(updateFields).length === 0) {
          return res.status(400).json({ message: "Only status/progress can be updated" });
        }
      } else {
        if (
          req.user.role === "Supervisor" &&
          (!existing.project?.supervisor || existing.project.supervisor.toString() !== req.user.id)
        ) {
          return res.status(403).json({ message: "You can only update tasks in your own projects" });
        }

        const { title, description, project, assignedTo, priority, deadline, status, progress } = req.body;
        updateFields = { title, description, project, assignedTo, priority, deadline, status, progress };
      }

      const updated = await Task.findByIdAndUpdate(req.params.id, updateFields, {
        new: true,
        runValidators: true,
      }).populate([
        { path: "project", select: "projectName" },
        { path: "assignedTo", select: "name" },
      ]);

      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// Delete task (Admin, or the Supervisor who owns the task's project)
router.delete("/:id", authMiddleware, roleMiddleware(["Admin", "Supervisor"]), async (req, res) => {
  try {
    const existing = await Task.findById(req.params.id).populate("project");
    if (!existing) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role === "Supervisor" &&
      (!existing.project?.supervisor || existing.project.supervisor.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: "You can only delete tasks in your own projects" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;