const express = require('express')
const {Message} = require('../models')// user model

const router = express.Router();

// 새로운 채팅방 만들기
router.post('/', async (req, res) => {
    try {
        const newMessage = await Message.create(req.body)
        return res.status(201).json(newMessage)
    } catch (error) {
        return res.status(500).json({error: 'Error creating ChatRooms'})
    }
})

module.exports = router;
