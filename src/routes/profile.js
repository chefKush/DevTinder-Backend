const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');


profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const userData = req.user; // user data is set in the userAuth middleware
        res.send(userData);
    }
    catch (error) {
        res.status(400).send('Error: ' + error.message);
    }
})

module.exports = profileRouter;