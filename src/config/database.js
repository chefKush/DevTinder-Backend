const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://Kushal:Aishu@humongous.tjajpyy.mongodb.net/DevTinder')
}

module.exports = connectDB;

