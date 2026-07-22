const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/auth");

// Get all notifications for the logged-in user, newest first
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .populate("triggeredBy", "name");
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Mark a single notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id }, // ensures users can only mark their own
      { read: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Mark all as read
router.put("/mark-all-read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;