const { sendResponse, AppError } = require("../helpers/utils.js");
const { body, validationResult } = require("express-validator");
const Task = require("../models/Task.js");
const taskController = {};

/*  create Task */
taskController.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.length)
      throw new AppError(401, "Bad request", errors, "invalid input");
    const allowUpdate = [
      "name",
      "description",
      "status",
      "assignee",
      "isFinished",
      "assignee",
    ];
    const updates = req.body;
    const updateKeys = Object.keys(updates);
    const notAllow = updateKeys.filter((el) => !allowUpdate.includes(el));
    if (notAllow.length) {
      throw new AppError(401, "Bad request", "filter Input is not validated");
    }
    const taskCreated = await Task.create(updates);
    sendResponse(res, 200, true, taskCreated, null, "TaskCreated");
  } catch (error) {
    next(error);
  }
};

/* Browse your tasks with filter allowance */

/**
 * @route GET API/task
 * @description Browse your tasks with filter allowance
 * @access private
 */

taskController.findTaskByFilter = async (req, res, next) => {
  try {
    const allowUpdate = [
      "name",
      "description",
      "status",
      "assignee",
      "isFinished",
      "assignee",
    ];
    const updates = req.query;
    const updateKeys = Object.keys(updates);
    const notAllow = updateKeys.filter((el) => !allowUpdate.includes(el));
    if (notAllow.length) {
      throw new AppError(401, "Bad request", "filter Input is not validated");
    }

    const findTaskByFilter = await Task.find(updates).sort([["createdAt", -1]]);
    if (Object.keys(findTaskByFilter).length === 0) {
      throw new AppError(401, "Bad request", "cant find filter");
    }
    sendResponse(res, 200, true, findTaskByFilter, null, "taskByFilterfound");
  } catch (error) {
    next(error);
  }
};

/* find task decription by id */
/**
 * @route GET API/tasks/description
 * @description find task decription by id
 * @access private
 */

taskController.findDescriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors) throw new AppError(401, "Bad request", "id is not valid");
    const findDescriptionById = await Task.findById(id);

    const decription = await findDescriptionById.description;
    sendResponse(res, 200, true, decription, null, "findDescriptionByIdfound");
  } catch (error) {
    next(error);
  }
};

/* You could assign member to a task or unassign them */

taskController.assignTaskToUser = async (req, res, next) => {
  const { assignee } = req.body;
  const { id } = req.params;
  try {
    const errors = validationResult(req);
    if (!errors) throw new AppError(401, "Bad request", "cant assign task");
    let updateTask = await Task.findById(id);
    updateTask.assignee = assignee;
    updateTask = await updateTask.save();
    sendResponse(res, 200, true, updateTask, null, "taskAssigned");
  } catch (error) {
    next(error);
  }
};

/* unassign member to a task */
/**
 * @route PUT API/tasks/:id
 * @description You could unassign them
 * @access private
 */

taskController.unassignTaskToUser = async (req, res, next) => {
  const { assignee } = req.body;
  const { id } = req.params;
  try {
    const errors = validationResult(req);
    if (!errors) throw new AppError(401, "Bad request", "cant unassign task");
    let updateTask = await Task.findById(id);
    if (updateTask.assignee.toString() === assignee) {
      updateTask.assignee = null;
    }
    updateTask = await updateTask.save();
    sendResponse(res, 200, true, updateTask, null, "taskUnassigned");
  } catch (error) {
    next(error);
  }
};

/* update task status */
taskController.updateStatus = async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    let updateTask = await Task.findById(id);
    const errors = validationResult(req);
    if (!errors) throw new AppError(401, "Bad request", "cant update task");
    if (status === "pending" || status === "working" || status === "review") {
      if (updateTask.isFinished === true) {
      } else {
        updateTask.status = status;
      }
    } else {
      updateTask.isFinished = true;
      updateTask.status = status;
      updateTask = await updateTask.save();
    }

    updateTask = await updateTask.save();
    sendResponse(res, 200, true, updateTask, null, "statusUpdated");
  } catch (error) {
    next(error);
  }
};

/* You could search all tasks of 1 member either by name or id */
taskController.findAllTaskOfMember = async (req, res, next) => {
  const asignee = req.params;
  try {
    let taskList = await Task.find(asignee);
    const errors = validationResult(req);
    if (!errors)
      throw new AppError(
        401,
        "Bad request",
        "cant search all tasks of a staff"
      );
    sendResponse(res, 200, true, taskList, "taskByFilterfound");
  } catch (error) {
    next(error);
  }
};

module.exports = taskController;
