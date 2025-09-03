const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
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

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const loggedInUserId = req.user._id;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ]
        }).select('fromUserId toUserId')

        const hideFromFeed = new Set();
        connections.map((req) => {
            hideFromFeed.add(req.fromUserId.toString());
            hideFromFeed.add(req.toUserId.toString());
        })

        const user = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideFromFeed) } },
                { _id: { $ne: loggedInUserId } }
            ]
        }).select(populateUserData).skip(skip).limit(limit);
        console.log(user);

        res.json({ message: "Feed fetched successfully", data: user });

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);

    }
})

module.exports = userRouter;