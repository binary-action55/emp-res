const bycrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const rootDirectory = require('../utils/rootDirectory');
const User = require(path.join(rootDirectory,'model','user'));


const SEQUELIZE_UNIQUE_ERROR = 'SequelizeUniqueConstraintError';

module.exports.signUp = async  (req, res, next) => {
  if (
    req.body.name == null ||
    req.body.email == null ||
    req.body.password == null
  ) {
    res.status(401).json({message:"Bad Input"});
  }

  try{
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const hash = bycrypt.hash(password,10);

  await User.create({
    name,
    email,
    password:hash,
  });

  return res.status(201).json({message:"successfully created user"});

 }catch(err){
    console.log(err);
    if(err.name===SEQUELIZE_UNIQUE_ERROR){
        return res.status(401).json({message:"Email is already registered"});
    }
    res.status(500).json({message:"Something Went Wrong"});  
 }
};

module.exports.login = async  (req, res, next) => {
    if (
    req.body.email == null ||
    req.body.password == null
  ) {
    res.status(400).json({message:"Bad Input"});
  }

  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findAll({where:{email}});
  if(user.length===0){
    return res.json(400).json({message:"user not found"});
  }
  const match = bycrypt.compare(password,user[0].password);

  if(!match){
    return res.status(400).json({message:"user not authorized"});
  }

  const token = jwt.sign({id:user[0].id},process.env.JWT_SECRET_KEY);
  return res.status(200).json({message:"Success Login",token});
};
