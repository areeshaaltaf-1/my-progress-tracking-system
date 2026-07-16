const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

// Create project (Admin only)
router.post("/create", authMiddleware, roleMiddleware(["Admin"]), async (req, res) => {
  try {
    const { projectName, description, supervisor, priority, startDate, endDate } = req.body;

    const project = await Project.create({
      projectName,
      description,
      supervisor,
      priority,
      startDate,
      endDate,
    });

    const populated = await project.populate("supervisor", "name department");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all projects (any logged-in user)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().populate("supervisor", "name department");
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update project (Admin only)
router.put("/:id", authMiddleware, roleMiddleware(["Admin"]), async (req, res) => {
  try {
    const { projectName, description, supervisor, priority, startDate, endDate, status } = req.body;

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { projectName, description, supervisor, priority, startDate, endDate, status },
      { new: true, runValidators: true }
    ).populate("supervisor", "name department");

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete project (Admin only)
router.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get single project (any logged-in user)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("supervisor", "name department");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;