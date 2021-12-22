const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { protect } = require("./authController");
const { promisify } = require("util");
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }
  const func = promisify(jwt.verify);
  const decoded = await func(token, process.env.JWT_SECRET);
  const tempUser = await User.findById(decoded.id);
  if (!tempUser) {
    return next(new AppError("The user doesnt exist", 401));
  }
  if (tempUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError("Please Log in again", 401));
  }
  req.user=tempUser;
  next();
});