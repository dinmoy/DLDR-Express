const express = require('express')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const {User, Classes, Favorite, Chatroom, EnrolledClasses, WatchHistories, Curriculum} = require('../models')// user model

const router = express.Router();

// 모든 유저 조회하기
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({success: true},users);
    } catch (error) {
        return res.status(500).json({success: false,error: 'Error fetching users'});
    }
});

// id로 유저 조회하기
router.get('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({error: 'Error fetching user'});
    }
});

// 유저가 만든 클래스 조회하기
router.get('/:id/classes', async (req, res) => {
    const userId = req.params.id;

    try {
        // 유저가 선생님일 때
        const classes = await Classes.findAll({where: {user_id: userId}})
        return res.status(200).json(classes);
    } catch (error) {
        return res.status(500).json({error: 'Error finding classes'})
    }
})

// 유저의 favorites 조회하기
router.get('/:id/favorites', async (req, res) => {
    const userId = req.params.id;

    try {
        const favorites = await Favorite.findAll({where: {user_id: userId}})

        const classPromises = favorites.map(async favorite => {
            return await Classes.findOne({
                where: {
                    id: favorite.class_id
                }
            });
        });

        const classes = await Promise.all(classPromises);
        return res.status(200).json(classes);

        return res.status(200).json(favorites);
    } catch (error) {
        return res.status(500).json({error: 'Error finding Favorites'})
    }
})

// 유저의 chatrooms 조회하기
router.get('/:id/chatrooms', async (req, res) => {
    const userId = req.params.id;

    try {
        const chatrooms = await Chatroom.findAll({
            where: {
                [Op.or]: {
                    teacher_user_id: userId,
                    student_user_id: userId
                }
            }
        })
        return res.status(200).json(chatrooms);
    } catch (error) {
        return res.status(500).json({error: 'Error finding Chatrooms'})
    }
})

// 유저의 enrolled_class 조회하기
router.get('/:id/enrolled_class', async (req, res) => {
    const userId = req.params.id;

    try {
        const enrolledClasses = await EnrolledClasses.findAll({
            where: {
                user_id: userId
            }
        });

        const classPromises = enrolledClasses.map(async enrolledClass => {
            return await Classes.findOne({
                where: {
                    id: enrolledClass.class_id
                }
            });
        });

        const classes = await Promise.all(classPromises);
        return res.status(200).json(classes);
    } catch (error) {
        return res.status(500).json({ error: 'Error finding Classes' });
    }
})

// 유저의 최근 시청 기록 조회하기
router.get('/:id/watch_histories', async (req, res) => {
    const userId = req.params.id
    try {
        const histories = await WatchHistories.findAll({
            where: {
                user_id: userId
            },
            order: [['createdAt', 'DESC']]
        })


        const curriculumsPromises = histories.map(async histories => {
            return await Curriculum.findOne({
                where: {
                    id: histories.curriculum_id
                }
            })
        })

        const curriculums = await Promise.all(curriculumsPromises)

        const classesPromise = curriculums.map(async curriculum => {
            return await Classes.findOne({
                where: {
                    id: curriculum.class_id
                }
            })
        })

        const classes = await Promise.all(classesPromise)

        return res.status(200).json(classes);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Error finding Histories' });
    }
})

// 유저 업데이트 하기
router.put('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        await user.update(req.body);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({error: 'Error updating user'});
    }
});

// 유저 삭제
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        await user.destroy();
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({error: 'Error deleting user'});
    }
});

module.exports = router;
