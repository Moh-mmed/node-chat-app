const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const User = require("./../models/userModel")


const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  //   const cookieOptions = {
  //     expires: new Date(
  //       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN + 24 * 60 * 60 * 1000
  //     ),
  //     httpOnly: true,
  //   };

  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOGU2ZDhjMGRhN2IxZGJhMjM2M2YxZSIsImlhdCI6MTY1MzUwMzMxMiwiZXhwIjoxNjU4Njg3MzEyfQ.QdSHm7QTGvBEqD1rEgmmGuWP8BipjWs3ZQf3YKBgU_o
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  //? Send the JWT via COOKIES, (expose it to the client-side)
  //   res.cookie("jwt", token, cookieOptions);

  //? Remove the password from the output
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

exports.signup = async (req, res, next) => {
    const user = await User.create(req.body);
    createSendToken(user, 201, res);
}; 

exports.login = async(req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        console.log("Email or password do not exist")
    //   return next(
    //     new AppError("Please provide valid email and password!", 400)
    //   );
    }

    const user = await User.findOne({ email: email }).select("+password");

    const correct =
      user && (await user.correctPassword(password, user.password));

    if (!user || !correct) {
        console.log("Incorrect email or password");
    //   return next(new AppError("Incorrect email or password", 401));
    }
    createSendToken(user, 200, res);
} 


exports.logout = async(req, res, next) => {
  res.status(200).json({
    status: "success"
  });
}; 


exports.protect = async (req, res, next) => {

    let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   }

    if (req.headers.bearer) {
        token = req.headers.bearer;
    }
    console.log(token)
    if (!token) {
        res.status(404).json({
          status: "fail",
          message: "You are not logged in, please log in",
        });
        return next();
    // return next(new AppError("You are not logged in, please log in"));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
        res.status(404).json({
          status: "fail",
          message: "The user belonging to this token is no longer exist.",
        });
        return next()
    }
        
    // return next(
    //   new AppError("The user belonging to this token is no longer exist.", 401)
    // );

  // Grant access to the protected route
  // We need this user in the next middleware
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
};