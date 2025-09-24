const socket = require('socket.io');
const crypto = require('crypto');

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash('sha256')
        .update([userId, targetUserId].sort().join('-'))
        .digest('hex')
}

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: 'http://localhost:5173'
        }
    })

    io.on('connection', (socket) => {
        socket.on('joinChat', ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId)
            console.log(`${firstName} is joining room: `, roomId);
            socket.join(roomId)
        })

        socket.on('sendMessage', ({ firstName,
            userId,
            targetUserId,
            text }) => {
            const roomId = getSecretRoomId(userId, targetUserId)
            // console.log('Message received: ', text + firstName);
            io.to(roomId).emit('receiveMessage', { firstName, userId, text })
        })

        socket.on('disconnect', () => { })
    })
}

module.exports = initializeSocket;