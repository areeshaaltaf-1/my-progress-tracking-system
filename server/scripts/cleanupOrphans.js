require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../db/db");

const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const WorkLog = require("../models/WorkLog");

async function cleanupOrphans() {
  await connectDB();

  console.log("Connected. Scanning for orphaned data...\n");

  // Get every user ID that currently exists
  const existingUsers = await User.find().select("_id");
  const existingUserIds = new Set(existingUsers.map((u) => u._id.toString()));

  // --- Orphaned projects: supervisor is set but that user no longer exists ---
  const allProjects = await Project.find();
  const orphanedProjects = allProjects.filter(
    (p) => p.supervisor && !existingUserIds.has(p.supervisor.toString())
  );

  console.log(`Found ${orphanedProjects.length} orphaned project(s):`);
  orphanedProjects.forEach((p) => console.log(`  - ${p.projectName} (${p._id})`));

  const orphanedProjectIds = orphanedProjects.map((p) => p._id);

  if (orphanedProjectIds.length > 0) {
    const tasksUnderOrphanedProjects = await Task.find({
      project: { $in: orphanedProjectIds },
    });
    const taskIdsToDelete = tasksUnderOrphanedProjects.map((t) => t._id);

    if (taskIdsToDelete.length > 0) {
      const wlResult = await WorkLog.deleteMany({ task: { $in: taskIdsToDelete } });
      console.log(`  Deleted ${wlResult.deletedCount} worklog(s) under those projects' tasks`);
    }

    const taskResult = await Task.deleteMany({ project: { $in: orphanedProjectIds } });
    console.log(`  Deleted ${taskResult.deletedCount} task(s) under orphaned projects`);

    const projResult = await Project.deleteMany({ _id: { $in: orphanedProjectIds } });
    console.log(`  Deleted ${projResult.deletedCount} orphaned project(s)`);
  }

  // --- Orphaned tasks: assignedTo is set but that user no longer exists ---
  // (re-fetch remaining tasks, since some were already removed above)
  const remainingTasks = await Task.find();
  const orphanedTasks = remainingTasks.filter(
    (t) => t.assignedTo && !existingUserIds.has(t.assignedTo.toString())
  );

  console.log(`\nFound ${orphanedTasks.length} orphaned task(s) (assigned to deleted interns):`);
  orphanedTasks.forEach((t) => console.log(`  - ${t.title} (${t._id})`));

  const orphanedTaskIds = orphanedTasks.map((t) => t._id);

  if (orphanedTaskIds.length > 0) {
    const wlResult = await WorkLog.deleteMany({ task: { $in: orphanedTaskIds } });
    console.log(`  Deleted ${wlResult.deletedCount} worklog(s) for orphaned tasks`);

    const taskResult = await Task.deleteMany({ _id: { $in: orphanedTaskIds } });
    console.log(`  Deleted ${taskResult.deletedCount} orphaned task(s)`);
  }

  console.log("\nCleanup complete.");
  await mongoose.disconnect();
  process.exit(0);
}

cleanupOrphans().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});