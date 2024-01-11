const express = require('express')
const { WatchHistories } = require('../models')

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const watchHistory = await WatchHistories.create(req.body);
        res.status(201).json(watchHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error enrolling class' });
    }
});

module.exports = router;