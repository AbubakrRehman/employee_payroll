// const express = require('express');
import express from "express";
const router = express.Router();
import PayrollController from "../controllers/payroll.controller.js";

router.get('/:month/:year', PayrollController.getPayrollByPeriod);
router.get('/:runId/slip/:employeeId', PayrollController.getEmployeePayslip);
router.post('/run', PayrollController.runPayroll);

export default router