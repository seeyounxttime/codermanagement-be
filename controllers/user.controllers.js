const { sendResponse, AppError } = require("../helpers/utils.js");
const { validationResult } = require("express-validator");

const User = require("../models/User.js");

const userController = {};

//Get all usersd
userController.getAllUsers = async (req, res, next) => {
  const filter = req.query;
  try {
    const found = await User.find({ isDeleted: false, ...filter }).populate(
      "tasks"
    );

    sendResponse(
      res,
      200,
      true,
      { data: found },
      null,
      "Get all users success"
    );
  } catch (error) {
    next(error);
  }
};

//Search user by name
userController.searchUser = async (req, res, next) => {
  const userName = req.params.name;
  try {
    const found = await User.find({ name: userName }).populate("tasks");

    if (!found || found.isDeleted)
      throw new AppError(404, "User not found", "Search error");

    sendResponse(res, 200, true, { data: found }, null, "User found");
  } catch (error) {
    next(error);
  }
};

//Create a user
userController.createUser = async (req, res, next) => {
  
  try {
    const userInfo = req.body;
    //always remember to control your inputs
    // if (!userInfo) throw new AppError(402, "Bad Request", "Create User Error");

    //Check if username is already existed in database
    // const existedName = await User.find({ name: userInfo.name });
    // if (!existedName) {
    //   throw new AppError(403, "User name already exist", "Create User Error");
    // }

    const newUser = await User.create(userInfo);
    sendResponse(
      res,
      200,
      true,
      { data: newUser },
      null,
      "Create user success"
    );
  } catch (errors) {
    next(errors);
  }
};

//Update a user
userController.updateUserById = async (req, res, next) => {
  
  const userId = req.params.id;
  const info = req.body;
  const options = { new: true };
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, info, options);
    sendResponse(
      res,
      200,
      true,
      { data: updatedUser },
      null,
      "Update user success"
    );
  } catch (error) {
    next(error);
  }
};

//Delete User
userController.deleteUserById = async (req, res, next) => {
  const targetId = req.params.id;
  const options = { new: true };
  try {
    const updated = await User.findByIdAndUpdate(
      targetId,
      { isDeleted: true },
      options
    );

    sendResponse(
      res,
      200,
      true,
      { data: updated },
      null,
      "Delete User success"
    );
  } catch (err) {
    next(err);
  }
};
//export
module.exports = userController;
