const path = require('path');
const Sequelize = require('sequelize');
const rootDirectory = require('../utils/rootDirectory');
const sequelize = require(path.join(rootDirectory,'utils','database'));

const Leave = sequelize.define('Leave',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    employeeId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    type:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    date:{
        type:Sequelize.DATEONLY,
        allowNull:false,
    }
});

module.exports = Leave;