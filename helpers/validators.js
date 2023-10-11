const { body } = require("express-validator");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const User = require("../models/User");
const Task = require("../models/Task");
const { sendResponse } = require("../helpers/utils");
const { validationResult, param } = require("express-validator");

const validators = {};

validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const message = errors
    .array()
    .map((error) => error.msg)
    .join(" & ");

  return sendResponse(res, 422, false, null, { message }, "Validation Error");
};

module.exports = validators;
