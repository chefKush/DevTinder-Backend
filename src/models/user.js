const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        trim: true
    },
    lastName: {
        type: String, required:
            true, minlength: 4, maxlength: 50, trim: true
    },
    email: {
        type: String, required: true, unique: true,
        match: /.+\@.+\..+/, lowercase: true, trim: true
    },
    password: {
        type: String,
        required: true, minlength: 6
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
    profilePicture: { type: String, default: 'https://example.com/default-profile.png' },
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

module.exports = mongoose.model('User', userSchema);