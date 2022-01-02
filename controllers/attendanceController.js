const Attendance = require('./../models/attendanceModels');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const Shift = require("./../models/shiftModels");
const Report = require('./../models/reportModels');
const childProcess = require('child_process');
exports.getAttendance = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Attendance.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const attendance = await features.query;
    res.status(200).json({
        status: 'success',
        results: attendance.length,
        data: {
            attendance
        }
    });
});

exports.getAttendanceById = catchAsync(async (req, res, next) => {
    let id = parseInt(req.body.id);
    let month = parseInt(req.body.month) - 1;
    let year = parseInt(req.body.year);
    console.log(id, month, year);
    let report = await Report.find({"userId": id, year, month});
    let data = [];
    let late = 0;
    let user = await User.findOne({userId: id});
    let name = user.name;
    let workingTime = 0;
    data.push(name);
    data.push(id);
    data.push(late);
    data.push(workingTime);
    for (let x in report) {
        let final = {};
        let present = report[x].present;
        final['date'] = new Date(report[x].expectedInTime).getDate();
        if (present === 'present') {
            final['in_time'] = new Date(report[x].inTime).toLocaleString("en-US", {timeZone: "Asia/Dhaka"}).slice(-10);
            final['out_time'] = new Date(report[x].outTime).toLocaleString("en-US", {timeZone: "Asia/Dhaka"}).slice(-10);
            final['late'] = (report[x].lateTime / 60000).toFixed(2);
            late += report[x].lateTime;
            final['present'] = 'present';
            final['workingTime'] = (report[x].workingTime / 3600000).toFixed(2);
            workingTime += report[x].workingTime
        } else {
            final['in_time'] = 0;
            final['out_time'] = 0;
            final['late'] = 0;
            final['present'] = 'absent';
            final['workingTime'] = 0;
        }
        data[2] = (late / 60000).toFixed(2);
        data[3] = (workingTime / 3600000).toFixed(2);
        console.log(final)
        data.push(final);
    }
    // res.status(200).json({data});
    res.render('./../views/monthlyresult.ejs', {data});
})

exports.daily = catchAsync(async (req, res, next) => {
    let date = parseInt(req.body.date);
    let month = parseInt(req.body.month) - 1;
    let year = parseInt(req.body.year);
    let users = await User.find();
    let data = [];
    let time = "N/A";
    for (let x in users) {
        let present = "absent"
        let report = await Attendance.find({userId: users[x].userId, year, month, date});
        let late = 0;
        if (typeof report[0].inTime != null) {
            const shift = await Shift.findOne({name: users[x].shift});
            let it = new Date(year, month, date, shift.inTimeHour, shift.inTimeMinute).getTime();
            if (report[0].inTime > it) {
                late = report[0].inTime - it;
            }
            present = "present";
            let h = new Date(report[0].inTime).getHours();
            let m = new Date(report[0].inTime).getMinutes();
            time = `${h}:${m}`
        }
        let f = {};
        f['ID'] = users[x].userId;
        f['name'] = users[x].name;
        f['inTime'] = new Date(report[0].inTime).toLocaleString("en-US", {timeZone: "Asia/Dhaka"}).slice(-10);
        f['late'] = (late / 60000).toFixed(2);
        f['present'] = present
        data.push(f);
    }
    res.render('./../views/dailyreport.ejs', {data});
})

exports.fetch = catchAsync(async (req, res) => {
    console.log("Starting to upload")
    const upload = childProcess.execSync('node upload.js');
    console.log(upload.toString());
    res.redirect('/tools')
})