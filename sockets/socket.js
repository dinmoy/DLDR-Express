const socketIO=require('socket.io')
const {User,ChatRoom,Message}=require('../models')

const Socket=(server)=>{
    const io=socketIO(server)
    io.on('connection',(socket)=>{
        console.log('a user connected')
    })
    return io
}

module.exports=Socket