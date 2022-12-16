const path = require("path");
const rootDirectory = require("../utils/rootDirectory");
const Employee = require(path.join(rootDirectory, "model", "Employee"));
const jwt = require("jsonwebtoken");
const e = require("express");
const sequelize = require(path.join(rootDirectory, "utils", "database"));

const SEQUELIZE_UNIQUE_ERROR = "SequelizeUniqueConstraintError";

module.exports.getAllEmployee = async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    return res.status(200).json({ message: "successful", employees });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.addEmployee = async (req, res, next) => {
  if (
    req.body.name == null ||
    req.body.position == null ||
    req.body.socialSecurity == null ||
    req.body.salary == null
  ) {
    return res.status(400).json({ message: "Bad Input" });
  }
  const name = req.body.name;
  const position = req.body.position;
  const salary = req.body.salary;
  const socialSecurity = req.body.socialSecurity;

  try {
    const employee = await Employee.create({
      name,
      position,
      socialSecurity,
      salary,
    });
    return res.status(201).json({ success: true, message: "Employee created" });
  } catch (err) {
    console.log(err);
    if (err.name === SEQUELIZE_UNIQUE_ERROR) {
      return res
        .status(400)
        .json({ success: false, message: "Duplicate employee input" }); // socialSecurity is unique
    }
    return res.status(500).json({ message: "Something Went Wrong" });
  }
};

module.exports.addManager = async (req, res, next) => {
  if (req.body.employeeId == null || req.body.managerId == null) {
    return res.status(400).json({ message: "Bad Input" });
  }

  const employeeId = req.body.employeeId;
  const managerId = req.body.managerId;

  if (employeeId == managerId) {
    return res
      .status(400)
      .json({ success: false, message: "managerId references employee" });
  }

  try {
    const employee = await Employee.findByPk(+employeeId);
    const manager = await Employee.findByPk(+managerId);

    if (employee === null) {
      return res
        .status(400)
        .json({ success: false, message: "employee id is not valid" });
    }
    if (manager === null) {
      return res
        .status(400)
        .json({ success: false, message: "manager id is not valid" });
    }

    await Employee.update(
      { managerId: manager.id },
      { where: { id: employee.id } }
    );
    return res.status(201).json({ message: "successfully added manager" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong" });
  }
};

module.exports.updateSalary = async (req, res, next) => {
  if (
    req.body.employeeId == null ||
    req.body.salary == null ||
    isNaN(+req.body.salary)
  ) {
    return res.status(400).json({ message: "Bad Input" });
  }

  const employeeId = req.body.employeeId;
  const salary = +req.body.salary;

  try {
    const employee = await Employee.findByPk(employeeId);
    if (employee === null) {
      return res.status(400).json({ message: "employee id is not valid" });
    }
    await employee.update({
      salary,
    });
    return res.status(201).json({
      success: true,
      message: `salary of employee updated to ${salary}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong" });
  }
};

module.exports.updatePost = async (req, res, next) => {
  if (req.body.employeeId == null || req.body.position == null) {
    return res.status(400).json({ message: "Bad Input" });
  }

  const employeeId = req.body.employeeId;
  const position = req.body.position;

  try {
    const employee = await Employee.findByPk(employeeId);
    if (employee === null) {
      return res.status(400).json({ message: "employee id is not valid" });
    }
    await employee.update({
      position,
    });
    return res.status(201).json({
      success: true,
      message: `position of employee updated to ${position}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong" });
  }
};

module.exports.removeEmployee = async (req, res, next) => {
  if (req.body.employeeId == null) {
    return res.status(400).json({ message: "Bad input" });
  }

  const employeeId = req.body.employeeId;
  const permissionToken = req.body.permissionToken;

  try {
    const employee = await Employee.findByPk(employeeId);
    if (employee === null) {
      return res.status(400).json({ message: "employee id is not valid" });
    }

    // Employee without manager doesnt require authorization
    if (employee.managerId === null) {
      const count = await Employee.destroy({ where: { id: employee.id } });
      return res
        .status(201)
        .json({ success: true, message: "employee removed" });
    }

    // Employee with manager can only be removed with authorization with jwt key from manager
    if (permissionToken == null) {
      return res.status(400).json({ message: "Missing authorization" });
    }

    const manager = await Employee.findByPk(employee.managerId);
    const verficationString =
      process.env.JWT_SECRET_KEY +
      manager.id +
      manager.position +
      "emp" +
      employee.id;
    jwt.verify(permissionToken, verficationString);
    await Employee.destroy({ where: { id: employee.id } });
    return res
      .status(201)
      .json({ success: true, message: "manager approved employee remove" });
  } catch (err) {
    console.log(err);
    if (err.name === jwt.JsonWebTokenError.name) {
      return res
        .status(400)
        .json({ success: false, message: "failed to authorize" });
    }
    return res.status(500).json({ message: "something went wrong" });
  }
};

module.exports.getEmployee = async (req, res, next) => {
  if (req.params.employeeId == null) {
    return res.status(400).json({ message: "Bad input" });
  }

  const employeeId = req.params.employeeId;

  try {
    const employee = await Employee.findByPk(employeeId);
    return res.status(200).json({ message: "success", employee });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.getRemovePermission = async (req, res, next) => {
  if (req.body.employeeId == null || req.body.managerId == null) {
    return res.status(400).json({ message: "Bad Input" });
  }

  const employeeId = req.body.employeeId;
  const managerId = req.body.managerId;

  if (employeeId == managerId) {
    return res
      .status(400)
      .json({ success: false, message: "managerId references employee" });
  }

  try {
    const employee = await Employee.findByPk(+employeeId);
    const manager = await Employee.findByPk(+managerId);

    if (employee === null) {
      return res
        .status(400)
        .json({ success: false, message: "employee id is not valid" });
    }
    if (manager === null) {
      return res
        .status(400)
        .json({ success: false, message: "manager id is not valid" });
    }

    if (employee.managerId !== manager.id) {
      return res
        .status(400)
        .json({ success: false, message: "manager does not manage employee" });
    }

    const verficationString =
      process.env.JWT_SECRET_KEY +
      manager.id +
      manager.position +
      "emp" +
      employee.id;
    const token = jwt.sign({ employeeId: employeeId }, verficationString);
    return res.status(201).json({
      message: "permission to remove granted",
      permissionToken: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong" });
  }
};

module.exports.getEmployeeWithManager = async (req, res, next) => {
  console.log("inside");
  try {
    const records =
      await sequelize.query(`Select e.name as ename,m.name as mname,e.salary as esalary,m.salary as msalary from employees as e , employees as m 
    where e.managerId = m.id`);
    return res.status(200).json({ success: true, employees: records[0] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
