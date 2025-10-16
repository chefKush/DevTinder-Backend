const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../models/chat');

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash('sha256')
        .update([userId, targetUserId].sort().join('-'))
        .digest('hex')
}

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            // origin: 'http://localhost:5173'
            origin: 'https://dev-tinder-front-end-delta.vercel.app',
        }
    })

    io.on('connection', (socket) => {
        socket.on('joinChat', ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId)
            console.log(`${firstName} is joining room: `, roomId);
            socket.join(roomId)
        })

        socket.on('sendMessage', async ({ firstName,
            userId,
            targetUserId,
            text }) => {
            const roomId = getSecretRoomId(userId, targetUserId)

            try {
                let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
                if (!chat) {
                    chat = new Chat({ participants: [userId, targetUserId], messages: [] });
                }
                chat.messages.push({ sender: userId, content: text });
                await chat.save();
                // console.log('Message received: ', text + firstName);
                io.to(roomId).emit('receiveMessage', { firstName, userId, text })
            } catch (error) {
                console.error('Error saving message: ', error);
            }

        })

        socket.on('disconnect', () => { })
    })
}

module.exports = initializeSocket;