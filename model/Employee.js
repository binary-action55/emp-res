const path = require('path');
const Sequelize = require('sequelize');
const rootDirectory = require('../utils/rootDirectory');
const sequelize = require(path.join(rootDirectory,'utils','database'));

const Employee = sequelize.define('Employee',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    salary:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    position:{
        type:Sequelize.STRING,
        allowNull:false,
    },
});

module.exports = Employee;