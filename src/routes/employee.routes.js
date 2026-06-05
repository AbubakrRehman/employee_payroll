// const express = require('express');
import express from "express";
const router = express.Router();
// const UserController = require('../controllers/user.controller');
import EmployeeController from "../controllers/employee.controller.js";

router.get('', EmployeeController.getEmployees);


// router.post('/', UserController.createUser);

// module.exports = router;
export default router