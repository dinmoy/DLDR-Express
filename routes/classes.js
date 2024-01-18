const { Op } = require('sequelize')
const sequelize = require('sequelize')
const express = require('express')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Classes, User, Review, Curriculum, Chatroom, Favorite, WatchHistories } = require('../models');
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

// upload thumbnail
router.post('/upload', upload.single('thumbnail'), async (req, res) => {
    try {
        const { filename, path: filePath } = req.file;
        const classId = req.body.classId;
        const oneClass = await Classes.findByPk(classId);
        if (oneClass) {
            oneClass.thumbnail = path.relative(path.join(__dirname, '..'), filePath);
            await oneClass.save();
            res.status(200).json({
                success: true,
                message: 'thumbnail uploaded successfully',
                thumbnail: oneClass.thumbnail
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Classes not found'
            });
        }
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

        console.log('users', users);
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
        return res.status(500).json({ error: 'Error reading classes' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const foundClass = await Classes.findByPk(id);

        res.status(200).json(foundClass);
    } catch (error) {
        res.status(500).json({ error: 'Error reading class'})
    }
})


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

//isWated X
//read one class's all curriculums
router.get('/:id/curriculums', async (req, res) => {
    const classId = req.params.id;
    const userId = req.body.userId; 
    try {
        const classCurriculums = await Curriculum.findAll({ where: { class_id: classId } });
        if (userId) {
            const watchedPromise = classCurriculums.map(async watchedClass => {
                const watched = await WatchHistories.findOne({
                    where: {
                        curriculum_id: watchedClass.id, 
                        user_id:userId
                    }
                });
                return {
                    ...watchedClass.dataValues,
                    isWatched: watched?true:false,
                };
            });
            const curriculumWithWatchStatus = await Promise.all(watchedPromise);
            return res.status(200).json(curriculumWithWatchStatus);
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

router.put('/:id',async (req,res)=>{
    const classId=req.params.id;
    try{
        const classes=await Classes.findByPk(classId);
        if(!classes){
            return res.status(404).json({error: 'Class not found'});
        }
        await classes.update(req.body);
        return res.status(200).json(classes);
    }catch(error){
        console.log(error)
        return res.status(500).json({error:'Error updating class'});
    }
})

module.exports = router;
