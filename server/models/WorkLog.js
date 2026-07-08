const mongoose = require("mongoose");

const workLogSchema = new mongoose.Schema({
  internee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },

  workDone: {
    type: String,
    required: true,
  },

  hoursSpent: {
    type: Number,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WorkLog", workLogSchema);