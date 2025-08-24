const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');


requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ['interested', 'ignored']
        if (!allowedStatus.includes(status)) {
            return res
                .status(400)
                .json({ message: `Invalid status: ${status}` });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },//I sent one to them
                { fromUserId: toUserId, toUserId: fromUserId } //They sent one to me.
            ]
        })
        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already exists!" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        await connectionRequest.save();
        res.json({ message: `${req.user.firstName} sent a connection request to ${toUser.firstName}` });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInUser = req.user._id;

        // validate status
        const allowedStatus = ['accepted', 'rejected']
        if (!allowedStatus.includes(status)) {
            return res
                .status(400)
                .json({ message: `Invalid status: ${status}` });
        }
        // validate requestId
        const connectionRequest = await ConnectionRequest.findOne(
            {
                _id: requestId,
                toUserId: loggedInUser,
                status: 'interested'
            }
        );
        if (!connectionRequest) {
            return res
                .status(404)
                .json({ message: 'Connection Request Does not exist' })
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: `Connection Request ${status} successfully`, data });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

module.exports = requestRouter;