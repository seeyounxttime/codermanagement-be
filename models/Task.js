const mongoose = require("mongoose");

// Create schema
const taskSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "working", "review", "done", "archive"],
    default: "pending",
    required: true
  },
  isDeleted: { type: Boolean, default: false, required: true }
});

// Create and export model
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
