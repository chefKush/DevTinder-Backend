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

module.exports = requestRouter;