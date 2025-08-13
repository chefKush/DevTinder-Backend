const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');


requestRouter.post('/sendConnectionRequest', userAuth, (req, res) => {
    const userFirstName = req.user.firstName;
    res.send(userFirstName + ' Sent a connection request')
})

module.exports = requestRouter;