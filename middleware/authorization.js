const path = require('path');
const jwt = require('jsonwebtoken');
const rootDirectory = require('../utils/rootDirectory');

//Model
const User = require(path.join(rootDirectory,'model','User'));

module.exports.authorize = async (req,res,next) =>{
    if(req.headers.authorization==null || req.headers.authorization.split(" ")[0]!=="Bearer"){
        return res.status(401).json({message:'User not Authorized'});
    }

    const token = req.headers.authorization.split(" ")[1];
    try{
        const body = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = await User.findByPk(body.id);
        if(user===null){
            return res.status(400).json({message:'user not found'});
        }
        req.body.user = user;
        next();
    }
    catch(err){
        console.log(err);
        if(err.name===jwt.JsonWebTokenError.name){
            return res.status(401).json({message:'User not Authorized'});
        }
        res.status(500).json({message:'Server Error'});
    }
}