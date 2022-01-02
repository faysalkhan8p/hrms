const User = require('../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.addUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        designation: req.body.designation,
        department: req.body.department,
        shift: req.body.shift
    });
    res.redirect('/adduser')
})