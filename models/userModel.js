const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
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
    photo: String,
    password: {
        type: String,
        require: [true, "Please provide password"],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        require: [true, "Please provide password"],
        minlength: 8,
        validate: {
            validator: function (el) {
                return el === this.password;
            }
        },
        select: false
    },
    passwordChangedAt: Date,
    designation: {
        type: String,
        required: [true, "Designation can't be empty"]
    }

});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedTimeStamp);
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
};
const User = mongoose.model("User", userSchema);
module.exports = User;