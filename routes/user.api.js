const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsersInfo,
  getAUser,
  updateUserByName,
  deleteUserByName,
} = require("../controllers/user.controllers.js");
//Read
/**
 * @route GET api/user/abc
 * @description get list of users
 * @access public
 */
router.get("/:name", getAUser);

//Read all user
/**
 * @route GET api/user
 * @description get list of users
 * @access public
 */
router.get("/", getUsersInfo);

//Create
/**
 * @route POST api/user/abc
 * @description create a user
 * @access secure
 */
router.post("/", createUser);

//Update
/**
 * @route PUT api/user/abc
 * @description update a user
 * @access secure
 */
router.put("/:name", updateUserByName);

//Delete
/**
 * @route DELETE api/user/abc
 * @description delete a user
 * @access secure
 */
router.delete("/:name", deleteUserByName);

//Export
module.exports = router;
