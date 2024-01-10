const express = require('express')
const { Favorite } = require('../models')// user model

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const newFavorite = await Favorite.create({
            ...req.body,
            is_deleted: 0
        })

        return res.status(201).json(newFavorite);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error creating favorite"})
    }
})

module.exports = router;
