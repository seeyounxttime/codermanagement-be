const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  addReference,
  deleteTask,
  getTaskById,
  updateStatus
} = require("../controllers/task.controllers.js");
const { body, param } = require("express-validator");
const validators = require("../helpers/validators.js");
const Task = require("../models/Task");
const mongoose = require("mongoose");
const User = require("../models/User.js");
const { ObjectId } = require("mongodb");

//Read
/**
 * @route GET api/Task
 * @description get list of Tasks
 * @access public
 */
router.get("/", getAllTasks);

//Create
/**
 * @route POST api/Task
 * @description create a Task
 * @access public
 */
router.post(
  "/",
  validators.validate([
    body("name")
      .trim()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Name should not be empty with a minimum length of 2")
      .custom(async (value) => {
        const found = await Task.findOne({ name: value });
        if (found) {
          throw new Error("Task name already exists");
        }
      }),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description should not be empty")
  ]),
  createTask
);

//Update assignee
/**
 * @route PUT api/Task
 * @description update reference to a Task
 * @access public
 */
router.put(
  "/:id",
  validators.validate([
    body("ref").custom(async (userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId))
        throw new Error("id not valid");

      const found = await User.findById(ObjectId(userId));
      if (!found) {
        throw new Error("User not exist");
      }
    })
  ]),
  addReference
);

//Update status
/**
 * @route PUT api/Task
 * @description update reference to a Task
 * @access public
 */
router.put("/:id/status", updateStatus);

//Delete
/**
 * @route Delete api/Task
 * @description delete a Task
 * @access public
 */
router.delete("/:id", deleteTask);

//Read
/**
 * @route GET api/Task
 * @description get a task by id
 * @access public
 */
router.get("/:id", getTaskById);

//export
module.exports = router;

//Update
