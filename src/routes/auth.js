const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');


authRouter.post('/signup', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
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

module.exports = authRouter;