const mongoose = require('mongoose');
const shiftSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: String,
    inTimeHour: Number,
    inTimeMinutes: Number,
    outTimeHour: Number,
    outTimeMinutes: Number,
    weekends: [Number]
})
const Shift = mongoose.model('Shift', shiftSchema);
module.exports = Shift;