const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await User.find()
    if(!users){
      return next(new AppError('No user found', 404))  
    }
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
});
