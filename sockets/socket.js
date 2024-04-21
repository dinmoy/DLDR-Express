const socketIO = require('socket.io');
const { User, Chatroom, Message, Classes } = require('../models');

const Socket = (server) => {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('A user connected');
        message(socket);
        readChatRoomList(socket);
        readChatList(socket);
        disconnect(socket);
    });

    return io;
};

// 메시지 전송
const message = async (socket) => {
    socket.on('reqMessage', async (messageObj) => {
        try {
            const { user_id, chatroom_id, message } = messageObj;
            const newMessage = await Message.create({
                user_id,
                chatroom_id,
                message,
            });

            await ChatRoom.update(
                { last_chat: newMessage },
                { where: { id: chatroom_id } }
            );

            socket.to(chatroom_id).emit('resMessage', newMessage);
        } catch (error) {
            console.log('Error sending message: ', error);
        }
    });
};

//특정 유저의 채팅방 목록 조회
const readChatRoomList = (socket) => {
    socket.on('reqChatRoomList', async (req) => {
        try {
            const { userId } = req;
            const user = await User.findByPk(userId)
            if (!user) {
                socket.emit('loginError', { message: 'User not found' })
            }
            const rooms = await Chatroom.findAll({
                where: { teacher_user_id: userId },
            })

            const chatroomDetails = await Promise.all(rooms.map(async (room) => {
                const teacher = await User.findByPk(room.teacher_user_id);
                const chatroomClass = await Classes.findByPk(room.class_id);

                return {
                    ...room.dataValues,
                    teacher: teacher ? teacher.dataValues : null,
                    class: chatroomClass ? chatroomClass.dataValues : null,
                }
            }))
            socket.emit('resChatRoomList', chatroomDetails);
        } catch (error) {
            console.error('Error handling login:', error);
        }
    })
}

//특정 채팅방의 채팅목록 조회
const readChatList = (socket) => {
    socket.on('reqChatList', async (req) => {
        const { roomId } = req
        socket.join(roomId)
        console.log(`${roomId}`)

        try {
            const chatList = await Message.findAll({
                where: { chatroom_id: roomId },
                order: [['createdAt', 'ASC']],
            })
            socket.emit('resChatList', chatList)
        } catch (error) {
            socket.emit('chatListError', { message: 'Error reading chatList' });
        }
    })
}

const disconnect = (socket) => {
    socket.on('disconnect', () => {
        console.log('Socket disconnected')
        socket.emit('loginError', { message: 'User not found' });
        return;
    })
}

module.exports = Socket