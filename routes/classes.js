const express = require('express')
const { Classes } = require('../models')

const router = express.Router();
// read all classes
router.get('/', async (req, res) => {
    try {
        const classes = await Classes.findAll();
        return res.status(200).json(classes);
    } catch (error) {
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

module.exports = router;
