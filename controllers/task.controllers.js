const { sendResponse, AppError } = require("../helpers/utils.js");
const { validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");
const Task = require("../models/Task.js");
const User = require("../models/User.js");

const taskController = {};

//Create a Task
taskController.createTask = async (req, res, next) => {
  const info = req.body;
  try {
    if (!info) throw new AppError(400, "Bad Request", "Create Task Error");

    let userFound;
    if (info.assignee) {
      userFound = await User.findById(ObjectId(info.assignee));

      userFound = await userFound.save();

      let status = "pending";
      if (userFound.role === "employee") {
        status = "working";
      } else if (userFound.role === "manager") {
        status = "review";
      }
      info.status = status;
    }

    //mongoose query
    const created = await Task.create(info);
    if (userFound) {
      userFound.tasks.push(ObjectId(created.id));
      userFound.save();
    }

    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Create Task Success"
    );
  } catch (err) {
    next(err);
  }
};
//updateTask
taskController.addReference = async (req, res, next) => {

  const taskId = req.params.id;
  const { ref } = req.body;
  const options = { new: true };

  try {
    let taskFound = await Task.findOne({ _id: ObjectId(taskId) });

    //add check to control if Task is notfound
    let userFound = await User.findById(ObjectId(ref));
    userFound.tasks.push(ObjectId(taskId));
    userFound = await userFound.save();

    taskFound.assignee = ObjectId(ref);

    let status = "pending";
    if (userFound.role === "employee") {
      status = "working";
    } else if (userFound.role === "manager") {
      status = "review";
    }
    taskFound.status = status;
    //mongoose query
    taskFound = await taskFound.save();
    sendResponse(
      res,
      200,
      true,
      { data: taskFound },
      null,
      "Add reference success"
    );
  } catch (err) {
    next(err);
  }
};

//Get all Task
taskController.getAllTasks = async (req, res, next) => {
  const filter = req.query;
  try {
    const listOfFound = await Task.find({
      isDeleted: false,
      ...filter
    }).populate("assignee");

    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of Tasks success"
    );
  } catch (err) {
    next(err);
  }
};

//Delete a task
taskController.deleteTask = async (req, res, next) => {
  const taskId = req.params.id;
  const options = { new: true };
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { isDeleted: true },
      options
    );

    sendResponse(
      res,
      200,
      true,
      { data: updatedTask },
      null,
      "Delete task success"
    );
  } catch (error) {
    next(error);
  }
};

//Get a task by id
taskController.getTaskById = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    const foundTask = await Task.findById(taskId).populate("assignee");

    if (!foundTask || foundTask.isDeleted)
      throw new AppError(404, "Task not found", "Search error");

    sendResponse(res, 200, true, { data: foundTask }, null, "Task found");
  } catch (error) {
    next(error);
  }
};

// Update Task Status
taskController.updateStatus = async (req, res, next) => {
  const status = req.body.status;
  const taskId = req.params.id;

  try {
    let foundTask = await Task.findById(taskId);

    if (!foundTask || foundTask.isDeleted)
      throw new AppError(404, "Task not found", "Search error");

    if (status === "done") {
      if (foundTask.status === "archive")
        throw new AppError(
          400,
          "Invalid status update",
          "Update Task Status Error"
        );

      foundTask.status = "done";
      foundTask = await foundTask.save();

      sendResponse(
        res,
        200,
        true,
        { data: foundTask },
        null,
        "Task status updated successfully"
      );
    } else if (status === "archive" && foundTask.status === "done") {
      foundTask.status = "archive";
      foundTask = await foundTask.save();

      sendResponse(
        res,
        200,
        true,
        { data: foundTask },
        null,
        "Task status updated successfully"
      );
    } else {
      throw new AppError(
        400,
        "Invalid status update",
        "Update Task Status Error"
      );
    }
  } catch (error) {
    next(error);
  }
};

//export
module.exports = taskController;
