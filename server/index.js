const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");

const taskRoutes = require("./routes/TaskRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Task Routes
app.use("/api/tasks", taskRoutes);

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});