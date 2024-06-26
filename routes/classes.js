const { Op } = require('sequelize')
const sequelize = require('sequelize')
const express = require('express')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Classes, User, Review, Curriculum, Chatroom, Favorite, WatchHistories, Test } = require('../models');
const { createCipheriv } = require('crypto');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/thumbnails');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}_${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage });

//클래스 생성 with 썸네일
router.post('/', upload.single('thumbnail'), async (req, res) => {
    try {
        const { filename } = req.file;
        const { user_id, subject_id, sub_title, name, introduction } = req.body;
        const newClass = await Classes.create({
            user_id: user_id,
            subject_id: subject_id,
            sub_title: sub_title,
            name: name,
            introduction: introduction,
            thumbnail: `uploads/thumbnails/${filename}`,
            is_deleted: 0
        })
        return res.status(201).json(newClass);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error uploading thumbnail'
        });
    }
});

// read all classes
router.get('/', async (req, res) => {
    const subjectId = req.query.subjectId;
    const keyword = req.query.keyword;
    const sort = req.query.sort;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const userId = req.query.user_id;

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
        }

        const classInfoPromises = classes.map(async (oneClass) => {
            const user = await User.findOne({
                where: {
                    id: oneClass.user_id
                }
            });
            const isFavorite = await Favorite.findOne({
                where: {
                    user_id: userId,
                    class_id: oneClass.id
                }
            });
            return {
                ...oneClass.dataValues,
                teacher: user.dataValues,
                isFavorite: !!isFavorite
            };
        });

        const classesWithUserInfo = await Promise.all(classInfoPromises);

        return res.status(200).json(classesWithUserInfo);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error reading classes' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const foundClass = await Classes.findByPk(id);

        res.status(200).json(foundClass);
    } catch (error) {
        res.status(500).json({ error: 'Error reading class' })
    }
})


//read one class's all reviews
router.get('/:id/reviews', async (req, res) => {
    const classId = req.params.id;

    try {
        const classReviews = await Review.findAll({ where: { class_id: classId } });

        const reviewPromises = classReviews.map(async review => {
            const user = await User.findOne({
                where: {
                    id: review.user_id
                }
            });
            return {
                ...review.dataValues,
                user: {
                    ...user.dataValues
                },
            };
        });
        const review = await Promise.all(reviewPromises);
        return res.status(200).json(review);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error reading reviews for the class' });
    }
});

//read one class's all curriculums
router.get('/:id/curriculums', async (req, res) => {
    const classId = req.params.id;
    const userId = req.query.userId;
    try {
        const classCurriculums = await Curriculum.findAll({ where: { class_id: classId } });
        if (userId) {
            const histories = await WatchHistories.findAll({
                where: {
                    user_id: userId,
                    curriculum_id: classCurriculums.map(curriculum => curriculum.id)
                }
            });
            const WatchStatus = classCurriculums.map(curriculum => {
                const watchedCurriculum = histories.find(history => history.curriculum_id === curriculum.id);
                return {
                    ...curriculum.dataValues,
                    isWatched: watchedCurriculum ? true : false,
                };
            });
            return res.status(200).json(WatchStatus);
        }
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

//read one class's all test
router.get('/:id/tests', async (req, res) => {
    const classId = req.params.id;
    try {
        const classCurriculums = await Curriculum.findAll({ where: { class_id: classId } });
        const curriculumId = classCurriculums.map(curriculum => curriculum.id)
        const classTest = await Test.findAll({ where: { curriculum_id: curriculumId } });
        return res.status(200).json(classTest);
    } catch (error) {
        console.error.log(error);
        return res.status(500).json({ error: 'Error reading all test' })
    }
})

router.put('/:id', async (req, res) => {
    const classId = req.params.id;
    try {
        const classes = await Classes.findByPk(classId);
        if (!classes) {
            return res.status(404).json({ error: 'Class not found' });
        }
        await classes.update(req.body);
        return res.status(200).json(classes);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Error updating class' });
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const findClass = await Classes.findByPk(id);

        if (!findClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        await findClass.destroy();
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting class' });
    }
})

module.exports = router;
