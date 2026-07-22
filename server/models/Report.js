const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    format: { type: String, enum: ["PDF", "Excel"], required: true },
    filePath: { type: String, required: true },   // where the file lives on disk
    fileName: { type: String, required: true },   // original filename, for display/download
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);