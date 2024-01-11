const express = require('express')
const {Chatroom, Message} = require('../models')// user model

const router = express.Router();

// 새로운 채팅방 만들기
router.post('/', async (req, res) => {
    try {

        const existChatroom = await Chatroom.findOne({
            where: req.body
        })

        if (existChatroom) {
            return res.status(400).json({ error: 'ChatRoom is already existing'})
        }

        const newChatroom = await Chatroom.create(req.body)
        return res.status(201).json(newChatroom)
    } catch (error) {
        return res.status(500).json('Error creating ChatRooms')
    }
})

router.get('/:id/messages', async (req, res) => {
    try {
        const existChatroom = await Chatroom.findOne({
            where: req.body
        })

        if (!existChatroom) {
            return res.status(404).json({error: 'Cannot find chatroom'})
        }

        const messages = await Message.findAll({
            where: {
                chatroom_id: req.params.id
            }
        })

        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json('Error reading ChatRoom\'s messages')
    }
})

module.exports = router;
