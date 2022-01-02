const Admin = require('./../models/adminModel');
const catchAsync = require("./../utils/catchAsync");
exports.login = catchAsync(async (req, res, next) => {
    const admin = await Admin.findOne({name: req.body.name, pass: req.body.pass});
    if (admin) {
        req.session.regenerate(function () {
            req.session.user = admin.name;
            res.redirect('/');
        });
    } else {
        res.redirect('/login');
    }
})
;

exports.logout = catchAsync(async (req, res, next) => {
    req.session.destroy();
    res.redirect('/login')
})

// exports.admin = catchAsync(async (req, res) => {
//     const admin = await Admin.create({name: 'admin', pass: 'pass'})
//     res.status(200).json({
//         admin
//     })
// })