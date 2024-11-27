const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./config.json');

const AUTH_KEY = process.env.AUTH_KEY;
let io;

module.exports = function (server) {
    io = socketIO(server, {
        cors: {
            origin: '*', 
        },
    });

    // Middleware for authenticating socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.headers?.token;
            const decodedUser = jwt.verify(token, AUTH_KEY);
            socket.userId = decodedUser.id; // Attach userId to the socket
            next();
        } catch (err) {
            socket.emit('error', 'Invalid token / unauthorized User.');
            return;
        }
    });

    // Handle socket connections
    io.on('connection', async (socket) => {
        const userId = socket?.userId;

        if (!userId) {
            socket.emit('error', 'Unauthorized connection.');
            socket.disconnect();
            return;
        }

        console.log(`User ${userId} connected`);
        socket.join(userId); // Join the user's personal room

        // Event: User sends a message
        socket.on('sendMessage', async (data) => {
            const { bookingId, receiverId, message } = data;

            // Basic validation
            if (!bookingId || !receiverId || !message) {
                socket.emit('error', 'Incomplete message data.');
                return;
            }

            // Emit message to the receiver
            io.to(receiverId).emit('receiveMessage', {
                bookingId,
                senderId: userId,
                message,
                timestamp: new Date(),
            });

            console.log(`Message sent from ${userId} to ${receiverId}: ${message}`);
        });

        // Event: Initiate a call
        socket.on('startCall', (data) => {
            const { bookingId, receiverId } = data;

            if (!bookingId || !receiverId) {
                socket.emit('error', 'Incomplete call data.');
                return;
            }

            // Notify the receiver of the incoming call
            io.to(receiverId).emit('incomingCall', {
                bookingId,
                callerId: userId,
                timestamp: new Date(),
            });

            console.log(`Call initiated by ${userId} to ${receiverId}`);
        });

        // Event: End a call
        socket.on('endCall', (data) => {
            const { bookingId, receiverId } = data;

            if (!bookingId || !receiverId) {
                socket.emit('error', 'Incomplete call data.');
                return;
            }

            // Notify the receiver that the call has ended
            io.to(receiverId).emit('callEnded', {
                bookingId,
                callerId: userId,
                timestamp: new Date(),
            });

            console.log(`Call ended by ${userId} with ${receiverId}`);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
            socket.leave(userId);
        });
    });
};

module.exports.io = () => io;
