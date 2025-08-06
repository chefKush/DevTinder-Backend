const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://dev:1234@cluster0.tjajpyy.mongodb.net/devtinder')
}

module.exports = connectDB;

  