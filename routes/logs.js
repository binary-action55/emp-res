const express = require('express');
const path = require('path');
const rootDirectory = require('../utils/rootDirectory');

const router = express.Router();

const logController = require(path.join(rootDirectory,'controller','logs'));

router.get('/all',logController.getAllLogs);
router.get('/:employeeId',logController.getEmployeeLogs);
router.post('/addLog',logController.registerLog);


module.exports = router;