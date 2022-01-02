const express = require("express");

const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");


const router = express.Router();

// router.route('/manual').post(authController.admin);
module.exports = router;