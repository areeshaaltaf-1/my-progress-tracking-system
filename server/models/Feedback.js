const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },

  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  internee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  comments: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);