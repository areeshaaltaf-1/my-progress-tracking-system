const Task = require("../models/Task");
const notify = require("../utils/notify");

const runDeadlineCheck = async () => {
  const now = new Date();
  const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  const tasks = await Task.find({ status: { $ne: "Completed" } }).populate("project", "projectName");

  for (const task of tasks) {
    if (!task.deadline) continue;

    if (task.deadline < now && !task.overdueNotified) {
      await notify({
        recipient: task.assignedTo,
        type: "task_overdue",
        title: "Task flagged as overdue",
        message: `'${task.title}' is now overdue.`,
        relatedTask: task._id,
        relatedProject: task.project?._id,
      });
      task.overdueNotified = true;
      await task.save();
    } else if (task.deadline <= in2Days && task.deadline > now && !task.deadlineWarned) {
      await notify({
        recipient: task.assignedTo,
        type: "task_deadline_approaching",
        title: "Deadline approaching",
        message: `'${task.title}' is due in 2 days.`,
        relatedTask: task._id,
        relatedProject: task.project?._id,
      });
      task.deadlineWarned = true;
      await task.save();
    }
  }
};

module.exports = runDeadlineCheck;