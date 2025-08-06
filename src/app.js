const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();

app.use(express.json());

app.post('/signup' , async (req, res) => {
    // creating a new instance of the User model
    const user = new User(req.body);
    // saving the user to the database
    try {
        await  user.save()
        res.send('User created successfully');
    } catch (error) {
        console.error('Error saving user:', error);  
    }
});

connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(7777, () => {
    console.log('Server is successfully listening on port 7777');
})
})
.catch((error) => {
    console.error('Database connection failed:', error);
});

