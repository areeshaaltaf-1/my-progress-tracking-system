const express = require("express");
const router = express.Router();

const taskController = require("../controllers/TaskController");

// Get All Tasks
router.get("/", taskController.getTasks);

// Get Single Task
router.get("/:id", taskController.getTaskById);

// Create Task
router.post("/", taskController.createTask);

// Update Task
router.put("/:id", taskController.updateTask);

// Delete Task
router.delete("/:id", taskController.deleteTask);

module.exports = router;