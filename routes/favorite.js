const express = require('express')
const { Favorite } = require('../models')// user model

const router = express.Router();

router.get('/',async(req,res)=>{
    try{
        const favorites=await Favorite.findAll()
        return res.status(200).json(favorites)
    }catch(error){
        console.log(error)
        return res.status(500).json({error: 'Error reading all favorites'})
    }
})

router.post('/', async (req, res) => {
    try {
        const newFavorite = await Favorite.create({
            ...req.body,
            is_deleted: 0
        })

        return res.status(201).json(newFavorite);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Error creating favorite'})
    }
})

router.put('/:id', async (req, res) => {
    try {
        const favoriteId = req.params.id
        const { user_id, class_id } = req.body

        const updatedFavorite = await Favorite.findOne({
            where: {
                user_id,
                class_id
            }
        })

        if (!updatedFavorite) {
            return res.status(404).json({ error: 'Cannot find favorite'})
        }

        const isDeleted = updatedFavorite.is_deleted === 1 ? 0 : 1

        await updatedFavorite.update({
            ...updatedFavorite,
            is_deleted: isDeleted
        })

        return res.status(200).json(updatedFavorite);
    } catch (error) {
        return res.status(500).json({ error: 'Error updating favorites'})
    }
})
module.exports = router;
