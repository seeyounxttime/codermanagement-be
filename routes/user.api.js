const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  updateUserById,
  deleteUserById,
  searchUser
} = require("../controllers/user.controllers.js");
const { body, param } = require("express-validator");
const validators = require("../helpers/validators.js");
const User = require("../models/User");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

//Read
/**
 * @route GET api/User
 * @description get list of Users
 * @access public
 */
router.get("/", getAllUsers);

//Create
/**
 * @route POST api/User
 * @description create a User
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
        const found = await User.findOne({ name: value });
        if (found) {
          throw new Error("User name already exists");
        }
      })
  ]),

  createUser
);

//Update
/**
 * @route PUT api/User
 * @description update a User
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
  updateUserById
);

//Delete
/**
 * @route DELETE api/User
 * @description delete a User
 * @access public
 */
router.delete("/:id", deleteUserById);

//Search
/**
 * @route GET api/user
 * @description search a user by name
 * @access public
 */
router.get("/:name", searchUser);

module.exports = router;
