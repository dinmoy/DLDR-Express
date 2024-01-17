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
        return res.status(200).json(classes);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error reading classes' });
    }
});


//read one class's all reviews
router.get('/:id/reviews', async (req, res) => {
    const classId = req.params.id;

    try {
        const classReviews = await Review.findAll({ where: { class_id: classId } });
        
        const reviewPromises=classReviews.map(async review =>{
            const user=await User.findOne({
                where:{
                    id:review.user_id
                }
            });
            return{
                ...review.dataValues,
                user:{
                    ...user.dataValues
                },
            };
        });
        const review=await Promise.all(reviewPromises);
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
                where:{
                    user_id:userId,
                    curriculum_id:classCurriculums.map(curriculum=>curriculum.id)
                }
            });
            const WatchStatus=classCurriculums.map(curriculum=>{
                const watchedCurriculum=histories.find(history => history.curriculum_id === curriculum.id);
                return {
                    ...curriculum.dataValues,
                    isWatched: watchedCurriculum?true:false,
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
router.get('/:id/tests',async(req,res)=>{
    const classId=req.params.id;
    try{
        const classCurriculums=await Curriculum.findAll({where: {class_id:classId}});
        const curriculumId=classCurriculums.map(curriculum => curriculum.id)
        const classTest=await Test.findAll({where: {curriculum_id:curriculumId} });
        return res.status(200).json(classTest);
    }catch(error){
        console.error.log(error);
        return res.status(500).json({error:'Error reading all test'})
    }
})

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
        return res.status(500).json({error:'Error updating class'});
    }
})

module.exports = router;
