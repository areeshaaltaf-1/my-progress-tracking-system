const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
const Project = require("../models/Project");
const Task = require("../models/Task");
const WorkLog = require("../models/WorkLog");

router.post("/create", authMiddleware, roleMiddleware(["Admin"]), async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/", authMiddleware, roleMiddleware(["Admin", "Supervisor"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete("/:id", authMiddleware, roleMiddleware(["Admin"]), async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToDelete.role === "Supervisor") {
      // Find all projects this supervisor owned
      const projectsToDelete = await Project.find({ supervisor: req.params.id });
      const projectIds = projectsToDelete.map((p) => p._id);

      if (projectIds.length > 0) {
        // Find all tasks under those projects
        const tasksToDelete = await Task.find({ project: { $in: projectIds } });
        const taskIds = tasksToDelete.map((t) => t._id);

        if (taskIds.length > 0) {
          await WorkLog.deleteMany({ task: { $in: taskIds } });
          await Task.deleteMany({ project: { $in: projectIds } });
        }

        await Project.deleteMany({ _id: { $in: projectIds } });
      }
    }

    if (userToDelete.role === "Internee") {
      // Find all tasks assigned to this intern
      const tasksToDelete = await Task.find({ assignedTo: req.params.id });
      const taskIds = tasksToDelete.map((t) => t._id);

      if (taskIds.length > 0) {
        await WorkLog.deleteMany({ task: { $in: taskIds } });
        await Task.deleteMany({ assignedTo: req.params.id });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User and related data deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put("/:id", authMiddleware, roleMiddleware(["Admin"]), async (req, res) => {
  try {
    const { name, email, role, department } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, department },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;