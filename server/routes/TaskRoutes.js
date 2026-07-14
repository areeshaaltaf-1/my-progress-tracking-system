const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

// Create task (Admin only)
router.post("/", authMiddleware, roleMiddleware(["Admin"]), async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, deadline } = req.body;

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

// Get all tasks (any logged-in user)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find().populate([
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
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update task (Admin only)
router.put("/:id", authMiddleware, roleMiddleware(["Admin"]), async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, deadline, status, progress } = req.body;

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, project, assignedTo, priority, deadline, status, progress },
      { new: true, runValidators: true }
    ).populate([
      { path: "project", select: "projectName" },
      { path: "assignedTo", select: "name" },
    ]);

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete task (Admin only)
router.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;