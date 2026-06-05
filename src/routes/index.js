// const express = require('express');
import express from "express";
const router = express.Router();

// const employeesRoutes = require('./employees.routes.js');
import employeesRoutes from "./employee.routes.js"
import payrollRoutes from "./payroll.routes.js"

// Centralize all routes under the /api/v1 prefix
router.use("/employees", employeesRoutes)
router.use("/payroll", payrollRoutes)


export default router