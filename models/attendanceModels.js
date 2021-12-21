const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    userId: Number,
    year: Number,
    month: Number,
    date: Number,
    day: Number,
    inTime: Number,
    outTime: Number
});
const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;