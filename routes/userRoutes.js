const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

//? Authenticate the User
router.get("/", authController.protect, userController.getAllUsers);

module.exports = router;
