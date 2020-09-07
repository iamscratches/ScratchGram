const jwt = require("jsonwebtoken");
const process = require("../nodemon.json")

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];
   // console.log(token);
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next();
  }catch(error){
    console.log("error");
    res.status(401).json({message: "Sorry you are not Authenticated!! Try Logging in first"});
  };
};
