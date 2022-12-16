const express = require('express');
const path = require('path');
const rootDirectory = require('../utils/rootDirectory');

const router = express.Router();

const leaveController = require(path.join(rootDirectory,'controller','leave'));

router.get('/all',leaveController.getAllLeave);
router.get('/:employeeId',leaveController.getEmployeeLeave);
router.post('/addLeave',leaveController.registerLeave);


module.exports = router;