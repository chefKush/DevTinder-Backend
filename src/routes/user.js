const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

const populateUserData = "firstName lastName profilePicture age gender about"

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', populateUserData)
        res.json({ message: "Connection Requests received", data: connectionRequest })


    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId, status: 'accepted' },
                { toUserId: loggedInUserId, status: 'accepted' }
            ]
        }).populate('fromUserId', populateUserData)
            .populate('toUserId', populateUserData)

        const data = connections.map(row => {
            if (row.fromUserId._id.equals(loggedInUserId)) {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({ message: "Connections fetched successfully", data })
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

module.exports = userRouter;