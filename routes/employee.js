const express = require('express');
const path = require('path');
const rootDirectory = require('../utils/rootDirectory');

const router = express.Router();

const employeeController = require(path.join(rootDirectory,'controller','employee'));

router.get('/all',employeeController.getAllEmployee);
router.post('/',employeeController.addEmployee);
router.post('/add-manager',employeeController.addManager);
router.post('/update-salary',employeeController.updateSalary);
router.post('/remove-employee',employeeController.removeEmployee);
router.get('/employee-manager',employeeController.getEmployeeWithManager);
router.get('/:employeeId',employeeController.getEmployee);
router.post('/update-post',employeeController.updatePost);
router.post('/remove-permission',employeeController.getRemovePermission);


module.exports = router;