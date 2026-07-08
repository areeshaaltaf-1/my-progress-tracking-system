const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },

  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  fileLink: {
    type: String,
  },

  submittedAt: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Submission", submissionSchema);