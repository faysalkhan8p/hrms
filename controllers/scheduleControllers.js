const Shift = require('./../models/shiftModels');
const Attendance = require('./../models/attendanceModels');
const Report = require('./../models/reportModels');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');


exports.addShift = catchAsync(async (req, res) => {
    const newShift = await Shift.create({
        id: req.body.id,
        name: req.body.name,
        inTimeHour: req.body.inTimeHour,
        inTimeMinute: req.body.inTimeMinute,
        outTimeHour: req.body.outTimeHour,
        outTimeMinute: req.body.outTimeMinute,
        weekends: req.body.weekends
    })
    res.status(201).json({
        status: "success", data: {
            shift: newShift
        }
    });
});
exports.createReport = catchAsync(async (req, res) => {
    const users = await User.find();
    const month = parseInt(req.params.month);
    let x = new Date();
    let year = x.getFullYear();
    let days = new Date(year, month + 1, 0).getDate();
    let ids = [];
    const off = req.body.off;
    users.forEach(user => {
        ids.push(user.userId);
    })
    for (let i = 0; i < ids.length; i++) {
        const user = await User.findOne({userId: ids[i]});
        const shift = await Shift.findOne({name: user.shift});
        for (let j = 1; j <= days; j++) {
            let it = new Date(year, month, j, shift.inTimeHour, shift.inTimeMinute);
            let t = it.getDay();
            if (off.find(element => element === j) || shift.weekends.find(element => element === t)) {
                continue;
            }
            let ot = new Date(year, month, j, shift.outTimeHour, shift.outTimeMinute);
            await Report.create({
                userId: user.userId,
                year: year,
                month: month,
                date: j,
                day: t,
                expectedInTime: it,
                expectedOutTime: ot,
                shift: shift.name
            })
        }
    }
    res.status(200).json({
        status: "Success"
    })
});

exports.generate = catchAsync(async (req, res) => {
    const month = parseInt(req.params.month);
    const reports = await Report.find({month});
    for (let x in reports) {
        const attendance = await Attendance.find({
            userId: reports[x].userId, year: reports[x].year, month: reports[x].month, date: reports[x].date
        });
        if (typeof attendance[0] === "undefined") {
            continue;
        }
        if (typeof attendance[0].inTime === "undefined" || typeof attendance[0].outTime === "undefined") {
            continue;
        }
        console.log(attendance)
        let late = 0;
        let id = reports[x]._id;
        // console.log(attendance[0].inTime)
        if (attendance[0].inTime > reports[x].expectedInTime) {
            late = attendance[0].inTime - reports[x].expectedInTime;
        }
        if (attendance[0].outTime < reports[x].expectedOutTime) {
            late += reports[x].expectedOutTime - attendance[0].outTime;
        }
        let workingTime = attendance[0].outTime - attendance[0].inTime;
        await Report.findByIdAndUpdate(id, {
            inTime: attendance[0].inTime,
            outTime: attendance[0].outTime,
            lateTime: late,
            workingTime: workingTime,
            present: "present"
        }, {
            new: true, runValidators: true
        });
    }
    res.status(200).json({
        status: "Success"
    })
})