const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const rootDirectory = require("./utils/rootDirectory");
const sequelize = require(path.join(rootDirectory, "utils", "database"));


//Routes
const userRoutes = require(path.join(rootDirectory, "routes", "user"));
const employeeRoutes = require(path.join(rootDirectory, "routes", "employee"));
const errorRoutes = require(path.join(rootDirectory, "routes", "error"));

//Models
const User = require(path.join(rootDirectory,'model','user'));
const Employee = require(path.join(rootDirectory,'model','employee'));


const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));


app.use("/user", userRoutes);
app.use("/employee", employeeRoutes);
app.use("/", errorRoutes);

Employee.belongsTo(Employee,{foriegnKey:'id',as: 'Manager'});

sequelize.sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
