const express = require("express");
const {
  createUser,
  getUser,
  getEmployeeByName,
  searchUserTask,
} = require("../controllers/user.controllers");
const router = express.Router();
const { body, validationResult, query } = require("express-validator");

/* Create a new user by user’s name. default role is employee */
/**
 * @route POST API/users
 * @description create user
 * @access public
 * @example 
 */
router.post("/", body("name").exists().isString(), createUser);

/* Browse for all your employee with filter */
/**
 * @route GET API/users
 * @description create user
 * @access public
 *@example 
 */
router.get("/", query().exists(), getUser);

module.exports = router;
