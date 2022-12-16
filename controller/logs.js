const path = require("path");
const rootDirectory = require("../utils/rootDirectory");
const Log = require(path.join(rootDirectory, "model", "Log"));
const Employee = require(path.join(rootDirectory, "model", "Employee"));

module.exports.getAllLogs = async (req,res,next) =>{
    try{
        const logs = await Log.findAll();
        return res.status(200).json({logs})
    }catch(err){
        console.log(err);
        return res.status(200).json({message:'something went wrong'});
    }
}

module.exports.registerLog = async (req,res,next) => {
    if (req.body.employeeId == null || req.body.type == null || isNaN(+req.body.employeeId)){
        return res.status(400).json({ message: "Bad Input" });
      }

    const employeeId = req.body.employeeId;
    const type = req.body.type;

    const employee = await Employee.findByPk(+employeeId);
    if(employee===null){
        return res.status(400).json({message:"employee does not exist"});
    }

    try{
        const log =  await Log.create({
            employeeId,
            type,
        });
        return res.status(201).json({success:true,message:"created log"});
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:'something went wrong'});
    }

}

module.exports.getEmployeeLogs = async (req,res,next) =>{
    if (req.params.employeeId == null || isNaN(+(req.params.employeeId))) {
        return res.status(400).json({ message: "Bad Input" });
      }
    
    const employeeId = req.params.employeeId;

    const employee = await Employee.findByPk(+employeeId);
    if(employee===null){
        return res.status(400).json({message:"employee does not exist"});
    }

    try{
        const logs = await Log.findAll({wherer:{employeeId}});
        return res.status(200).json({logs})
    }catch(err){
        console.log(err);
        return res.status(200).json({message:'something went wrong'});
    }
}

