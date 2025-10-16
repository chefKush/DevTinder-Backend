const express = require('express');
const { userAuth } = require('../middlewares/auth');
const Chat = require('../models/chat');
const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    const userId = req.user._id;
    const targetUserId = req.params.targetUserId;

    try {
        const chat = await Chat
            .findOne({ participants: { $all: [userId, targetUserId] } })
            .populate({ path: "messages.sender", select: "firstName lastName profilePicture" });;
        if (!chat) {
            chat = new Chat({ participants: [userId, targetUserId], messages: [] });
            await chat.save()
        }
        res.json(chat)
    } catch (error) {
        console.error('Error fetching/creating chat: ', error);
    }
})

module.exports = chatRouter;