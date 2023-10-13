const { sendResponse, AppError } = require("../helpers/utils.js");
const { query, body, param, validationResult } = require("express-validator");
const Task = require("../models/Task.js");
const User = require("../models/User.js");

const taskController = {};
//Create a task
taskController.createTask = async (req, res, next) => {
  const info = {
    name: req.body.name,
    active: true,
    description: req.body.description,
    status: req.body.status,
  };
  try {
    //check body by express-validator
    await body("name").notEmpty().withMessage("Empty name!").run(req);
    await body("description")
      .notEmpty()
      .withMessage("Empty descitption!")
      .run(req);
    await body("status").notEmpty().withMessage("Empty status!").run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //process
    const created = await Task.create(info);
    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Create task Success"
    );
  } catch (err) {
    next(err);
  }
};

//Update task status
taskController.updateTaskStatus = async (req, res, next) => {
  try {
    console.log(req.params.id);
    //check param and query by express-validator
    await param("id").notEmpty().withMessage("Empty task id!").run(req);
    await param("id").isMongoId().withMessage("Wrong task id!").run(req);
    await body("status").notEmpty().withMessage("Empty status!").run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //process
    const taskId = req.params.id;
    const { status } = req.body;

    let successTask = null;
    const refFound = await Task.findOneAndUpdate(
      { _id: taskId, active: true },
      { status },
      { new: true }
    );
    console.log(refFound);
    if (refFound.status === status) successTask = taskId;
    sendResponse(
      res,
      200,
      true,
      { users: successTask },
      null,
      "Add user success"
    );
  } catch (err) {
    next(err);
  }
};

//Add users to task
taskController.addReference = async (req, res, next) => {
  try {
    //check param and query by express-validator
    await param("id").notEmpty().withMessage("Empty task id!").run(req);
    await param("id").isMongoId().withMessage("Wrong task id!").run(req);
    await body("users").notEmpty().withMessage("Empty users!").run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //process
    const taskId = req.params.id;
    const { users } = req.body;
    const successName = [];

    let found = await User.find({ name: { $in: users } });
    if (found.length <= 0)
      return res.status(400).json({ errors: [{ msg: "Invalid data" }] });
    for (const e of found) {
      const refFound = await Task.findOneAndUpdate(
        { _id: taskId, active: true },
        { $addToSet: { users: e._id } },
        { new: true }
      );
      console.log(refFound);
      if (refFound.users.includes(e._id)) successName.push(e.name);
    }
    console.log(successName);
    sendResponse(
      res,
      200,
      true,
      { users: successName },
      null,
      "Add user success"
    );
  } catch (err) {
    next(err);
  }
};

//Delete users from task
taskController.deleteReference = async (req, res, next) => {
  try {
    //check param and query by express-validator
    await param("id").notEmpty().withMessage("Empty task id!").run(req);
    await param("id").isMongoId().withMessage("Wrong task id!").run(req);
    await body("users").notEmpty().withMessage("Empty users!").run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //process
    const taskId = req.params.id;
    const { users } = req.body;
    const successName = [];

    if (users.length <= 0)
      return res.status(400).json({ errors: [{ msg: "No data" }] });
    let found = await User.find({ name: { $in: users } });
    if (found.length <= 0)
      return res.status(400).json({ errors: [{ msg: "Invalid dat" }] });
    for (const e of found) {
      const refFound = await Task.findOneAndUpdate(
        { _id: taskId, active: true },
        { $pull: { users: e._id } }
      );
      if (refFound.users.includes(e._id)) successName.push(e.name);
    }
    console.log(successName);
    sendResponse(
      res,
      200,
      true,
      { users: successName },
      null,
      "Delete user success"
    );
  } catch (err) {
    next(err);
  }
};

//Get all task
taskController.getAllTasks = async (req, res, next) => {
  let filter = { active: true };
  if (req.query.name) filter = { ...filter, name: { $regex: req.query.name } };
  if (req.query.status) filter = { ...filter, status: req.query.status };
  if (req.query.id) filter = { ...filter, _id: req.query.id };
  const sortByTime =
    req.query.time === "forward" ? 1 : req.query.time === "backward" ? -1 : 0;
  try {
    const listOfFound = await Task.find(filter)
      .populate("users", "-password")
      .sort({ createdAt: sortByTime });
    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of tasks success"
    );
  } catch (err) {
    next(err);
  }
};

//Get a task
taskController.getTask = async (req, res, next) => {
  try {
    //check param by express-validator
    await param("id").notEmpty().withMessage("Empty task id!").run(req);
    await param("id").isMongoId().withMessage("Wrong task id!").run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //process
    const id = req.params.id;
    const filter = { _id: id, active: true };
    const listOfFound = await Task.find(filter).populate("users", "-password");
    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of tasks success"
    );
  } catch (err) {
    next(err);
  }
};

//Delete a task
taskController.deleteTask = async (req, res, next) => {
  try {
    //check query by express-validator
    await query("id").notEmpty().withMessage("Empty task id!").run(req);
    await query("id").isMongoId().withMessage("Wrong task id!").run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //process
    const taskId = req.query.id;
    const taskChange = await Task.findOneAndUpdate(
      { _id: taskId, active: true },
      { active: false }
    );
    if (taskChange?.active === true)
      sendResponse(res, 200, true, { id: taskId }, null, "Delete task success");
    else return res.status(400).json({ errors: [{ msg: "Invalid data" }] });
  } catch (err) {
    next(err);
  }
};

//Export
module.exports = taskController;
