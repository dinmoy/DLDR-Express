const express = require('express')
const http = require('http')
const { Message } = require('../models')// user model
const socketIO = require('socket.io')
const router = express.Router();

//서버 생성
const server = http.createServer(router);
const io = socketIO(server);


// 새로운 채팅방 만들기
router.post('/', async (req, res) => {
    try {
        const newMessage = await Message.create(req.body)
        //실시간 메시지 전송
        io.emit('chat message', newMessage)
        return res.status(201).json(newMessage)
    } catch (error) {
        return res.status(500).json({ error: 'Error creating ChatRooms' })
    }
})

//socket.io 연결 관리
io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('not connect', () => {
        console.log('user not connect')
    })
})



module.exports = router;
