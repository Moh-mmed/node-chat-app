const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const User = require("./../models/userModel")
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          parseInt(process.env.JWT_COOKIE_EXPIRES_IN) +
          24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;

  //* Send also the token to the client
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    createSendToken(user, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new AppError("Please provide valid email and password!", 400)
        );
    }

    const user = await User.findOne({ email: email }).select("+password");

    const correct =
        user && (await user.correctPassword(password, user.password));

    if (!user || !correct) {
        return next(new AppError("Incorrect email or password", 401));
    }
    createSendToken(user, 200, res);
}); 

exports.logout = catchAsync(async(req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
}); 

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    }
    if (!token) {
        return next(new AppError("You are not logged in, please log in"));
    }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
        return next(
          new AppError(
            "The user belonging to this token is no longer exist.",
            401
          )
        );
    }
        
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});