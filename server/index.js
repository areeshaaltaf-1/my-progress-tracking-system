require("dotenv").config(); // ← must be at the very top

const express = require("express");
const cors = require("cors");

const connectDB = require("./db/db");

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const workLogRoutes = require("./routes/workLogRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const runDeadlineCheck = require("./jobs/deadlineCheck");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/worklogs", workLogRoutes);
app.use("/api/notifications", notificationRoutes);

// Start Server
const PORT = process.env.PORT || 5000; // ← from .env now

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  runDeadlineCheck(); // run once on startup
  setInterval(runDeadlineCheck, 1000); // then every hour
});