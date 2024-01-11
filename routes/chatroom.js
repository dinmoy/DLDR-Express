const express = require('express')
const {Chatroom, User} = require('../models')// user model

const router = express.Router();

// 새로운 채팅방 만들기
router.post('/', async (req, res) => {
    try {
        const newChatroom = await Chatroom.create(req.body)
        return res.status(201).json(newChatroom)
    } catch (error) {
        return res.status(500).json('Error creating ChatRooms')
    }
})

module.exports = router;
