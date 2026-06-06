// const express = require('express');
import express from "express";
const router = express.Router();
import PayrollController from "../controllers/payroll.controller.js";
import validate from "../middlewares/validate.js";
import { createPayrollSchema, getEmployeePayslipSchema, getPayrollByPeriodSchema } from "../validations/payroll.validation.js";

router.get('/:month/:year', validate(getPayrollByPeriodSchema), PayrollController.getPayrollByPeriod);
router.get('/:runId/slip/:employeeId', validate(getEmployeePayslipSchema), PayrollController.getEmployeePayslip);
router.post('/run', validate(createPayrollSchema), PayrollController.runPayroll);

export default router