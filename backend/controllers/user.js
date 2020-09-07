const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const process = require('../nodemon.json');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });

    user.save().then(result => {
      res.status(201).json({
        message: "User created",
        result: result
      });
    }).catch(err => {
      console.log("error1");
      res.status(500).json({
          message: "Email Id already Exists!! Please try another email"
      });
    });
  });
}

exports.userLogin =  (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email}).then(user => {
    if(!user){
      res.status(401).json({
        message: 'Username doesn\'t Exist'
      });
      return "exit";
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if(result === "exit")
      return;
    if(!result){
      return res.status(401).json({
        message: 'Wrong Username or password'
      });
    }
    const token = jwt.sign({
      email:fetchedUser.email,
      userId:fetchedUser._id
    }, process.env.JWT_KEY, {expiresIn: '1h'});
    res.status(200).json({
      token: token,
      expiresIn:3600,
      userId: fetchedUser._id
    });
  }).catch(error => {
    return res.status(401).json({
      message: 'Authorization failed!!'
    });
  });
}
