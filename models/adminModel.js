const mongoose = require('mongoose');
const adSchema = new mongoose.Schema({
    name: String,
    pass: String
});
const Ad = mongoose.model('Ad', adSchema);
module.exports = Ad;