const express = require('express')
const { EnrolledClasses } = require('../models')

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { user_id, class_id } = req.body;
        const enrolledClass = await EnrolledClasses.create({
            user_id,
            class_id,
            is_deleted: 0
        });
        res.status(201).json(enrolledClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error enrolling class' });
    }
});

module.exports = router;