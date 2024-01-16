const express = require('express')
const { Subject } = require('../models')// user model

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.findAll();

        return res.status(200).json(subjects)
    } catch (error) {
        return res.status(500).json('Error reading ChatRoom\'s messages')
    }
})

module.exports = router;
