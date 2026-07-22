const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
const WorkLog = require("../models/WorkLog");
const notify = require("../utils/notify");

// Recalculates and saves a project's status based on its tasks' current statuses.
// Fully bidirectional: can advance to "Ongoing"/"Completed" or fall back to "Pending"/"Ongoing".
async function syncProjectStatus(projectId) {
  const tasks = await Task.find({ project: projectId });

  let newStatus;
  if (tasks.length === 0) {
    return;
  } else if (tasks.every((t) => t.status === "Completed")) {
    newStatus = "Completed";
  } else if (tasks.some((t) => t.status !== "Pending")) {
    newStatus = "Ongoing";
  } else {
    newStatus = "Pending";
  }

  const projectDoc = await Project.findById(projectId);
  const alreadyCompleted = projectDoc.status === "Completed";

  await Project.findByIdAndUpdate(projectId, { status: newStatus });

  if (newStatus === "Completed" && !alreadyCompleted) {
    const admins = await User.find({ role: "Admin" });
    for (const admin of admins) {
      await notify({
        recipient: admin._id,
        type: "project_completed",
        title: "Project completed",
        message: `'${projectDoc.projectName}' has been marked as Completed.`,
        relatedProject: projectId,
      });
    }
  }
}

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

    await syncProjectStatus(project);

    await notify({
      recipient: assignedTo,
      type: "task_assigned",
      title: "New task assigned",
      message: `You were assigned '${title}' on ${projectDoc.projectName}.`,
      relatedTask: task._id,
      relatedProject: project,
      triggeredBy: req.user.id,
    });

    const populated = await task.populate([
      { path: "project", select: "projectName" },
      { path: "assignedTo", select: "name email department" },
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
      { path: "assignedTo", select: "name email department" },
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
      { path: "assignedTo", select: "name email department" },
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
        { path: "assignedTo", select: "name email department" },
      ]);

      await syncProjectStatus(updated.project._id);

      if (
        req.user.role === "Internee" &&
        existing.project?.supervisor &&
        updateFields.status !== undefined &&
        updateFields.status !== existing.status
      ) {
        await notify({
          recipient: existing.project.supervisor,
          type: "task_status_changed",
          title: `Task moved to ${updateFields.status}`,
          message: `'${existing.title}' was moved to ${updateFields.status}.`,
          relatedTask: existing._id,
          relatedProject: existing.project._id,
          triggeredBy: req.user.id,
        });
      }

      if (
        req.user.role === "Internee" &&
        existing.project?.supervisor &&
        updateFields.progress !== undefined &&
        updateFields.progress > existing.progress
      ) {
        await notify({
          recipient: existing.project.supervisor,
          type: "task_progress_updated",
          title: "Progress updated",
          message: `Progress on '${existing.title}' updated to ${updateFields.progress}%.`,
          relatedTask: existing._id,
          relatedProject: existing.project._id,
          triggeredBy: req.user.id,
        });
      }

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

    await WorkLog.deleteMany({ task: req.params.id });
    await Task.findByIdAndDelete(req.params.id);

    await syncProjectStatus(existing.project._id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;