const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const xlsx = require("xlsx");
const Task = require("../models/Task");
const Project = require("../models/Project");
const Report = require("../models/Report");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

// Configure where + how uploaded files are stored on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "reports"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".xlsx", ".xls"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Excel files are allowed"));
    }
  },
});

// Upload a report (Supervisor only)
router.post(
  "/upload",
  authMiddleware,
  roleMiddleware(["Supervisor"]),
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, project, format } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      if (!title || !project || !format) {
        return res.status(400).json({ message: "Title, project and format are required" });
      }

      const report = await Report.create({
        title,
        project,
        format,
        filePath: req.file.path,
        fileName: req.file.originalname,
        uploadedBy: req.user.id,
      });

      const populated = await report.populate([
        { path: "project", select: "projectName" },
        { path: "uploadedBy", select: "name" },
      ]);

      res.status(201).json(populated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Get reports — Admin sees all, Supervisor sees only their own
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === "Admin" ? {} : { uploadedBy: req.user.id };

    const reports = await Report.find(filter)
      .populate("project", "projectName")
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download a report file
router.get("/:id/download", authMiddleware, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    res.download(report.filePath, report.fileName);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
// Generate a report from real project data (Supervisor only)
router.post("/generate", authMiddleware, roleMiddleware(["Supervisor"]), async (req, res) => {
  try {
    const { project, format, title } = req.body;

    if (!project || !format) {
      return res.status(400).json({ message: "Project and format are required" });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    const tasks = await Task.find({ project }).populate("assignedTo", "name");

    const reportTitle = title?.trim() || `${projectDoc.projectName} - Progress Report`;
    const fileName = `${Date.now()}-${reportTitle.replace(/[^a-z0-9]/gi, "_")}.${format === "PDF" ? "pdf" : "xlsx"}`;
    const filePath = path.join(__dirname, "..", "uploads", "reports", fileName);

    if (format === "PDF") {
      await generatePdf(filePath, projectDoc, tasks);
    } else {
      generateExcel(filePath, projectDoc, tasks);
    }

    const report = await Report.create({
      title: reportTitle,
      project,
      format,
      filePath,
      fileName,
      uploadedBy: req.user.id,
    });

    const populated = await report.populate([
      { path: "project", select: "projectName" },
      { path: "uploadedBy", select: "name" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper: builds a PDF file listing the project's tasks
function generatePdf(filePath, projectDoc, tasks) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text(`${projectDoc.projectName} - Progress Report`, { underline: true });
    doc.moveDown();
    doc.fontSize(10).fillColor("#666").text(`Generated: ${new Date().toLocaleDateString("en-GB")}`);
    doc.moveDown(1.5);

    if (tasks.length === 0) {
      doc.fontSize(12).fillColor("#000").text("No tasks found for this project.");
    } else {
      tasks.forEach((t, i) => {
        doc.fontSize(12).fillColor("#000").text(`${i + 1}. ${t.title}`, { continued: false });
        doc.fontSize(10).fillColor("#444").text(
          `   Assigned to: ${t.assignedTo?.name || "Unassigned"}  |  Status: ${t.status}  |  Progress: ${t.progress}%  |  Deadline: ${t.deadline ? new Date(t.deadline).toLocaleDateString("en-GB") : "N/A"}`
        );
        doc.moveDown(0.6);
      });
    }

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

// Helper: builds an Excel file listing the project's tasks
function generateExcel(filePath, projectDoc, tasks) {
  const rows = tasks.map((t) => ({
    Title: t.title,
    "Assigned To": t.assignedTo?.name || "Unassigned",
    Status: t.status,
    "Progress (%)": t.progress,
    Deadline: t.deadline ? new Date(t.deadline).toLocaleDateString("en-GB") : "N/A",
  }));

  const worksheet = xlsx.utils.json_to_sheet(rows.length > 0 ? rows : [{ Title: "No tasks found" }]);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Report");
  xlsx.writeFile(workbook, filePath);
}