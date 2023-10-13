const express = require("express");
const router = express.Router();
const {
  createTask,
  updateTask,
  getTaskById,
  deleteTask,
  getTasks,
} = require("../controllers/task.controllers");

// Post task
/**
 * @route POST api/task
 * @descriptions create a new task
 * @access private, assiger
 */
router.post("/", createTask);

// Put task
/**
 * @route PUT api/tasks/:id
 * @description update status or assignee to assign or unassign task to employee
 * @access private, assigner
 * @allowUpdates : {
 * "description": string,
 * "new status":string,
 * "new owner":objectId string to assign task,
 * "remove owner":objectId string to owner
 * }
 */

router.put("/:id", updateTask);

// Get by id task
/**
 * @route GET api/tasks/:id
 * @description get detail description of this task by task's id
 * @access private, assigner
 */

router.get("/:id", getTaskById);

// Get all tasks
/**
 * @route GET api/tasks
 * @description Get all task
 * @access private, assigner
 */

router.get("/", getTasks);

// Delete task
/**
 * @route DELETE api/tasks/:id
 * @description delete task when done
 * @access private, assigner
 */

router.delete("/:id", deleteTask);

module.exports = router;
