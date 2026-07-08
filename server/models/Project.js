const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  startDate: {
    type: Date,
  },

  endDate: {
    type: Date,
  },

  status: {
    type: String,
    enum: ["Pending", "Ongoing", "Completed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Project", projectSchema);