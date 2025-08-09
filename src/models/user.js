const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Enter a strong password');
            }
        }
    },
    age: { type: Number, min: 18 },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error('Gender data is not valid');
            }
        }

    },
    about: { type: String, maxlength: 500, trim: true, default: 'No information provided' },
    profilePicture: {
        type: String, default: 'https://example.com/default-profile.png',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Profile picture URL is not valid');
            }
        }
    },
    skills: {
        type: [String],
        default: [],
        validate: {
            validator: function (arr) {
                return arr.length <= 10;
            },
            message: 'You can add up to 10 skills only.'
        }
    },
},
    {
        timestamps: true
    });

userSchema.methods.getJWT = async function () {
    const userData = this
    const token = await jwt.sign({ userId: userData._id }, "Kush@123", { expiresIn: '7d' })
    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const userData = this;
    const passwordHash = userData.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;

}

module.exports = mongoose.model('User', userSchema);