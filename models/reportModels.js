const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
    userId: Number,
    year: Number,
    month: Number,
    date: Number,
    day: Number,
    inTime: Number,
    outTime: Number,
    workingTime: Number,
    lateTime: Number,
    shift: String
});
const Report = mongoose.model('Report', reportSchema);
module.exports = Report;