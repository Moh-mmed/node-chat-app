const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("./../models/userModel")

exports.signup = async (req, res, next) => {
    const user = await User.create(req.body);
    
    res.status(200).json({
        status: "success",
        user
    });
}; 

exports.login = async(req, res, next) => {

    res.status(200).json({
        status: 'success',
        message:' You are logged in successfully'
    })
} 


exports.logout = async(req, res, next) => {
  res.status(200).json({
    status: "success"
  });
}; 