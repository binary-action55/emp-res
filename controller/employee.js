const path = require('path');
const rootDirectory = require('../utils/rootDirectory');
const Employee = require(path.join(rootDirectory,'model','Employee'));


module.exports.getAllEmployee = async (req,res,next) =>{
    try{
        const employees = await Employee.findAll({attributes:['name','salary','position','ManagerId']});
        return res.status(200).json({message:"successful",employees});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Something went wrong"});
    }
}

module.exports.addEmployee = async (req,res,next) => {
    if(req.body.name==null ||
        req.body.position==null ||
        req.body.salary==null){
            return res.status(400).json({message:"Bad Input"});
    }
    const name = req.body.name;
    const position = req.body.position;
    const salary = req.body.salary;
    
    try{
        const employee = await Employee.create({
            name,
            position,
            salary,
        })
        return res.status(201).json({message:"Employee created"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Something Went Wrong"});
    }
}