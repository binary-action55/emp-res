const express = require('express');
const path = require('path');
const rootDirectory = require('../utils/rootDirectory');

const router = express.Router();

const employeeController = require(path.join(rootDirectory,'controller','employee'));

router.get('/all',employeeController.getAllEmployee);
router.post('/',employeeController.addEmployee);


module.exports = router;