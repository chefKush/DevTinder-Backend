const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('./utils/validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser())

// post user
app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        // Validate the incoming req(data)
        validateSignUpData(req);

        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword);
        // creating a new instance of the User model
        const user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save()
        res.send('User created successfully');
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userData = await User.findOne({ email: email });
        if (!userData) {
            throw new Error('User not found');
        }
        const isPasswordValid = await userData.validatePassword(password);
        if (isPasswordValid) {
            const jwtToken = await userData.getJWT()
            res.cookie('token', jwtToken, { expires: new Date(Date.now() + 1 * 3600000) }); // 1 hours expiry
            res.send('Login successful');
        } else {
            throw new Error('Invalid Credentials');
        }
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        const userData = req.user; // user data is set in the userAuth middleware
        res.send(userData);
    }
    catch (error) {
        res.status(400).send('Error: ' + error.message);
    }
})

app.post('/sendConnectionRequest', userAuth, (req, res) => {
    const userFirstName = req.user.firstName;
    res.send(userFirstName + ' Sent a connection request')
})



connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(7777, () => {
        console.log('Server is successfully listening on port 7777');
    })
})
    .catch((error) => {
        console.error('Database connection failed:', error);
    });

