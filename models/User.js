const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      default: "employee",
      enum: ["manager", "employee"],
      required: true,
    },
    // tasks: {type:[mongoose.SchemaTypes.ObjectId], ref:"Task"},

    isDeleted: { type: Boolean, default: false, required: true },
  },
  { timetamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
