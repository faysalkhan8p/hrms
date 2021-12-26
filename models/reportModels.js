const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
    userId: Number,
    year: Number,
    month: Number,
    date: Number,
    day: Number,
    expectedInTime: Number,
    expectedOutTime: Number,
    inTime: Number,
    outTime: Number,
    workingTime: Number,
    lateTime: Number,
    shift: String,
    present: {
        type: String,
        default: "absent"
    }
});
const Report = mongoose.model('Report', reportSchema);
module.exports = Report;