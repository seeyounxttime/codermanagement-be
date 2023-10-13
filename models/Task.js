const mongoose = require("mongoose");
//Create schema
const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    active: {type: Boolean, required: true},
    description: { type:String, required: true},
    status: {type: String, enum:["pending","working","review","done","archive"] ,default: "pending"},
    users: [{type: mongoose.SchemaTypes.ObjectId, ref: "User"}],
  },
  {
    timestamps: true,
  }
);
//Create and export model
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;