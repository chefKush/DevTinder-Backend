const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateProfileUpdateData, validateUpdatePassword } = require('../utils/validator');
const bcrypt = require('bcrypt');


profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const userData = req.user; // user data is set in the userAuth middleware
        res.send(userData);
    }
    catch (error) {
        res.status(400).send('Error: ' + error.message);
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileUpdateData(req)) {
            throw new Error('Invalid profile update data');
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        await loggedInUser.save(); // This will trigger schema validations
        res.json({ message: 'Profile updated successfully', data: loggedInUser });

    } catch (error) {
        res.status(400).send('Error: ' + error.message);
    }
})

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        await validateUpdatePassword(req);
        const { newPassword } = req.body;
        const loggedInUser = req.user;

        const newHashPassword = await bcrypt.hash(newPassword, 10)
        loggedInUser.password = newHashPassword;

        const updatePassword = await loggedInUser.save();
        if (updatePassword) {
            res.send('Password updated successfully');
        }
    } catch (error) {
        res.status(400).send('Error: ' + error.message);

    }

})


module.exports = profileRouter;