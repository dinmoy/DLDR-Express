const {Op} = require('sequelize')
const sequelize = require('sequelize')
const express = require('express')
const {Classes, User, Review, Curriculum, Chatroom, Favorite} = require('../models')

const router = express.Router();

// read all classes
router.get('/', async (req, res) => {
    const subjectId = req.query.subjectId;
    const keyword = req.query.keyword;
    const sort = req.query.sort;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;

    try {
        let classes;
        if (keyword) {
            classes = await Classes.findAll({
                where: {
                    name: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            });
        } else {
            classes = await Classes.findAll();
        }

        if (sort) {
            if (sort === 'popular') {
                const popularClassIds = await Favorite.findAll({
                    attributes: ['class_id', [sequelize.fn('COUNT', sequelize.col('class_id')), 'classCount']],
                    group: ['class_id'],
                    order: [[sequelize.literal('classCount'), 'DESC']],
                });

                const classIds = popularClassIds.map((item) => item.class_id);

                classes = await Classes.findAll({
                    where: {
                        id: {
                            [Op.in]: classIds,
                        },
                    },
                    order: [[sequelize.literal(`FIELD(id, ${classIds.join(',')})`)]],
                    limit: limit,
                });
            } else if (sort === 'new') {
                classes = await Classes.findAll({
                    order: [['createdAt', 'DESC']],
                    limit: limit,
                });
            }
        } else {
            classes = await Classes.findAll();
        }
        if (subjectId) {
            classes = await Classes.findAll({
                where: {
                    subject_id: subjectId
                }
            });
        } else {
            classes = await Classes.findAll();
        }

        const userPromises = classes.map(async oneClass => {
            return await User.findOne({
                where: {
                    id: oneClass.user_id
                }
            })
        });


        const users = await Promise.all(userPromises);

        console.log('users',users);
        const data = classes.map((oneClass, index) => {
            return {
                ...oneClass.dataValues,
                teacher: {
                    ...users[index].dataValues
                }
            }
        });

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Error reading classes'});
    }
});


//read one class's all reviews
router.get('/:id/reviews', async (req, res) => {
    const classId = req.params.id;
    try {
        const classReviews = await Review.findAll({where: {class_id: classId}});
        return res.status(200).json(classReviews);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Error reading reviews for the class'});
    }
});

//read one class's all curriculums
router.get('/:id/curriculums', async (req, res) => {
    const classId = req.params.id;
    try {
        const classCurriculums = await Curriculum.findAll({where: {class_id: classId}});
        return res.status(200).json(classCurriculums);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Error reading class all curriculums'});
    }
});

//read one class's all chatrooms
router.get('/:id/chatrooms', async (req, res) => {
    const classId = req.params.id;
    try {
        const classChatrooms = await Chatroom.findAll({where: {class_id: classId}});
        return res.status(200).json(classChatrooms);
    } catch (error) {
        return res.status(500).json({error: 'Error reading chatrooms'})
    }
});

//read class's favorite
router.get('/:id/favorite', async (req, res) => {
    const classId = req.params.id;
    try {
        const classFavorite = await Favorite.findAll({where: {class_id: classId}});
        return res.status(200).json(classFavorite);
    } catch (error) {
        return res.status(500).json({error: 'Error reading favorites'});
    }
});


module.exports = router;
