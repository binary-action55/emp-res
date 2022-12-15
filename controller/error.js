module.exports.error404 = (req,res,next) => {
    return res.status(404).json({message:"404 Not Found "});
}