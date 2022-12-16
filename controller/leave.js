const path = require("path");
const rootDirectory = require("../utils/rootDirectory");
const Leave = require(path.join(rootDirectory, "model", "Leave"));
const Employee = require(path.join(rootDirectory, "model", "Employee"));

module.exports.getAllLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findAll();
    return res.status(200).json({ leave });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ message: "something went wrong" });
  }
};

module.exports.registerLeave = async (req, res, next) => {
  if (
    req.body.employeeId == null ||
    req.body.type == null ||
    req.body.date == null ||
    isNaN(+req.body.employeeId)
  ) {
    return res.status(400).json({ message: "Bad Input" });
  }

  const employeeId = req.body.employeeId;
  const type = req.body.type;


  const date = new Date(req.body.date);

  const employee = await Employee.findByPk(+employeeId);
  if (employee === null) {
    return res.status(400).json({ message: "employee does not exist" });
  }

  try {
    const leave = await Leave.create({
      employeeId,
      type,
      date,
    });
    return res.status(201).json({ success: true, message: "created log" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};

module.exports.getEmployeeLeave = async (req, res, next) => {
  if (req.params.employeeId == null || isNaN(+req.params.employeeId)) {
    return res.status(400).json({ message: "Bad Input" });
  }

  const employeeId = req.params.employeeId;

  const employee = await Employee.findByPk(+employeeId);
  if (employee === null) {
    return res.status(400).json({ message: "employee does not exist" });
  }

  try {
    const leave = await Leave.findAll({ where: { employeeId } });
    return res.status(200).json({ leave });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ message: "something went wrong" });
  }
};
