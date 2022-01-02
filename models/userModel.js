const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: [true, 'ID needed'],
        unique: true
    },
    name: {
        type: String,
        require: [true, "Name needed"]
    },
    email: {
        type: String,
        require: [true, "Email needed"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Provide a valid Email"]
    },
    designation: {
        type: String,
        required: [true, "Designation can't be empty"]
    },
    department: String,
    shift: String,

});

const User = mongoose.model("User", userSchema);
module.exports = User;