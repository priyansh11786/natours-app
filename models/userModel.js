const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: [true, 'A user must have a name']
    },
    email: {
        type: 'string',
        required: [true, 'A user must have a email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    photo: {
        type: 'string',
        default: 'default.jpg'
    },
    role: {
        type: 'string',
        enum: ['user', 'admin', 'lead-guide', 'guide'],
        default: 'user'
    },
    password: {
        type: 'string',
        required: [true, 'A user must have a password'],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: 'string',
        required: [true, 'A user must have a password'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "Password and confirm password should be same"
        }
    },
    changedPasswordAt: 'Date',
    passwordResetToken: 'string',
    passwordResetExpires: 'Date',
    active: {
        type: 'boolean',
        default: true,
        select: false
    }
})

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined; 
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } })
    next();
})



//This is a instance method which can be accessed by the objects of 'userSchema' from anywhere. 
//Hashed password is userPassword, candidatePassword is the password we got from req.body
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};


userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.changedPasswordAt) {
        const changedTimeStamp = parseInt(this.changedPasswordAt.getTime() / 1000, 10);
        return JWTTimeStamp < changedTimeStamp;
    }

    //Return if password has not changed
    return false;
}

userSchema.methods.createResetPasswordToken = function () {
    //Random token generated
    const resetToken = crypto.randomBytes(32).toString('hex');

    //Hashed random token, so that if attacker gains access to the database he can't access our token
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema)
module.exports = User;