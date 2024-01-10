const express = require('express')
const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');
const { User } = require('../models')// user model

const router = express.Router();

// TODO: bcrypt 사용, session 사용해서 구현하기
// TODO: 프로필 업로드 PUT method 구현하기

// Create a new user
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error creating user' });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching users' });
    }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching user' });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update(req.body);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Error updating user' });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();
        return res.status(204).json(); // No content
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;
