const { Op } = require('sequelize')
const express = require('express')
const { Classes, User, Review, Curriculum, Chatroom, Favorite } = require('../models')

const router = express.Router();

// read all classes
router.get('/', async (req, res) => {
    const keyword = req.query.keyword;
    let classes;

    try {
        if (keyword) {
            classes = await Classes.findAll({
                where: {
                    name: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            });
        }
        else {
            classes = await Classes.findAll();
        }
        return res.status(200).json(classes);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error reading classes' });
    }
});

// create class
router.post('/', async (req, res) => {
    try {
        const newClass = await Classes.create(req.body);
        return res.status(201).json(newClass);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error creating class' });
    }
});

// update class by id 
router.put('/:id', async (req, res) => {
    const classId = req.params.id;
    try {
        const updatedClass = await Classes.findByPk(classId);
        if (!updatedClass) {
            return res.status(404).json({ error: 'Class Not Found' });
        }
        await updatedClass.update(req.body);
        return res.status(200).json(updatedClass);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error updating class' });
    }
});

// delete class by id
router.delete('/:id', async (req, res) => {
    const classId = req.params.id;
    try {
        const deletedClass = await Classes.findByPk(classId);
        if (!deletedClass) {
            return res.status(404).json({ error: 'Class Not Found' });
        }
        await deletedClass.destroy();
        return res.status(204).json();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error deleting class' });
    }
});


//read one class's all reviews
router.get('/:id/reviews', async (req, res) => {
    const classId = req.params.id;
    try {
        const classReviews = await Review.findAll({ where: { class_id: classId } });
        return res.status(200).json(classReviews);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error reading reviews for the class' });
    }
});

//read one class's all curriculums
router.get('/:id/curriculums', async (req, res) => {
    const classId = req.params.id;
    try {
        const classCurriculums = await Curriculum.findAll({ where: { class_id: classId } });
        return res.status(200).json(classCurriculums);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error reading class all curriculums' });
    }
});

//read one class's all chatrooms
router.get('/:id/chatrooms', async (req, res) => {
    const classId = req.params.id;
    try {
        const classChatrooms = await Chatroom.findAll({ where: { class_id: classId } });
        return res.status(200).json(classChatrooms);
    } catch (error) {
        return res.status(500).json({ error: 'Error reading chatrooms' })
    }
});

//read class's favorite
router.get('/:id/favorite', async (req, res) => {
    const classId = req.params.id;
    try {
        const classFavorite = await Favorite.findAll({ where: { class_id: classId } });
        return res.status(200).json(classFavorite);
    } catch (error) {
        return res.status(500).json({ error: 'Error reading favorites' });
    }
});


module.exports = router;
