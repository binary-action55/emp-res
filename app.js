const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const rootDirectory = require("./utils/rootDirectory");
const sequelize = require(path.join(rootDirectory, "utils", "database"));


//Routes
const userRoutes = require(path.join(rootDirectory, "routes", "user"));
const employeeRoutes = require(path.join(rootDirectory, "routes", "employee"));
const errorRoutes = require(path.join(rootDirectory, "routes", "error"));
const logRoutes = require(path.join(rootDirectory, "routes", "logs"));

//Models
const User = require(path.join(rootDirectory,'model','user'));
const Employee = require(path.join(rootDirectory,'model','employee'));

//Middleware
const userAuthorization = require(path.join(rootDirectory,'middleware','authorization'));

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));


app.use("/user", userRoutes);
app.use("/employee", userAuthorization.authorize,employeeRoutes);
app.use("/log", userAuthorization.authorize,logRoutes);
app.use("/", errorRoutes);

Employee.belongsTo(Employee,{foreignKey:'managerId',targetKey:"id",contraints:true,onDelete:'SET NULL'});

sequelize.sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
