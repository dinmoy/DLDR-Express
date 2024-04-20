const socketIO=require('socket.io')
const {User,ChatRoom,Message}=require('../models')

const Socket=(server)=>{
    const io=socketIO(server)
    io.on('connection',(socket)=>{
        console.log('a user connected')
        message(socket)
        disconnect(socket)
    })
    return io
}

//메시지 전송
const message = async (socket) => {
    socket.on('reqMessage', async (messageObj) => {
        try {
            const { user_id, chatroom_id, message } = messageObj;
            const newMessage = await Message.create({
                user_id,
                chatroom_id,
                message,
            })

            await ChatRoom.update(
                { last_chat: newMessage },
                { where: { id: chatroom_id } }
            )
            socket.to(chatroom_id).emit('resMessage', newMessage);
        } catch (error) {
            console.log('Error sending message: ', error);
        }
    })
}

const disconnect=(socket)=>{
    socket.on('disconnect',()=>{
        console.log('socket disconnected')
    })
}
module.exports=Socket