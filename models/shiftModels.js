const mongoose = require('mongoose');
const shiftSchema = new mongoose.Schema({
    id: Number,
    name: String,
    inTimeHour: Number,
    inTimeMinute: Number,
    outTimeHour: Number,
    outTimeMinute: Number,
    weekends: [Number]
})
const Shift = mongoose.model('Shift', shiftSchema);
module.exports = Shift;
