const express = require("express");
const {
  createUser,
  getUser,
  getUserById,
} = require("../controllers/user.controllers");

const router = express.Router();

// Get all users
/**
 * @route GET api/users
 * @description Get a list of users
 * @access private
 * @allowedQueries: name
 */
router.get("/", getUser);

// Get a single user by id
/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */

router.get("/:id", getUserById);

//  Create a new user (manager's access)
router.post("/", createUser);
/**
 * @route POST api/users
 * @description Create a new user
 * @access private, manager
 * @requiredBody: name
 */

module.exports = router;
