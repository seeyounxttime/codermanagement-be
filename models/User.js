const mongoose = require("mongoose");

//Create schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["employee", "manager"],
      default: "employee",
      // required: true
    },
    assignee: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Task",
    },
  },
  {
    timestamps: true,
  }
);

//Create and export model
const User = mongoose.model("users", userSchema);
module.exports = User;
