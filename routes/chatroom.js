const express = require('express')
const {Chatroom, Message, User, Classes } = require('../models')// user model

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

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id

        const chatroom = await Chatroom.findByPk(id);

        if (!chatroom) {
            return res.status(404).json({ error: 'Chatroom doesnt Exists'})
        }

        // 유저가 학생일 때
        const teacher = await User.findByPk(chatroom.teacher_user_id);

        const chatroomClass = await Classes.findByPk(chatroom.class_id);

        const data = {
            ...chatroom.dataValues,
            "teacher": {
                ...teacher.dataValues
            },
            "class": {
                ...chatroomClass.dataValues
            }
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Error Find ChatRoom'})
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
