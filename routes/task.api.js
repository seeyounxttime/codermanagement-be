const express= require("express")

const router = express.Router()
const {addReference,deleteReference,updateTaskStatus,createTask, getAllTasks,deleteTask, getTask} = require("../controllers/task.controllers.js")

//Read
/**
 * @route GET api/task
 * @description get list of tasks
 * @access public
 */
router.get("/",getAllTasks)

//Read
/**
 * @route GET api/task/123727272...
 * @description get a task
 * @access public
 */
router.get("/:id",getTask)

//Create
/**
 * @route POST api/task
 * @description create a task
 * @access public
 */
router.post("/",createTask)

//Delete task
/**
 * @route PUT api/task
 * @description update reference to a task
 * @access public
 */
router.delete("/",deleteTask)

//Update
/**
 * @route PUT api/task/delete-user/abc
 * @description delete reference to a task by user name
 * @access public
 */
router.put("/:id/update-status",updateTaskStatus)

//Update
/**
 * @route PUT api/task/add-user/abc
 * @description add reference to a task by user name
 * @access public
 */
router.put("/:id/add-user",addReference)

//Update
/**
 * @route PUT api/task/delete-user/abc
 * @description delete reference to a task by user name
 * @access public
 */
router.put("/:id/delete-user",deleteReference)


//export
module.exports= router