const { Op } = require('sequelize')
const express = require('express')
const { Classes, User, Review, Curriculum, Chatroom, Favorite } = require('../models')

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/video');
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

// upload video
router.post('/upload', upload.single('videofile'), async (req, res) => {
    try {
        const { filename, path: filePath } = req.file;

        const classId = req.body.classId;
        const classes = await Classes.findByPk(classId);
        if (classes) {
            classes.videofile = path.relative(path.join(__dirname, '..'), filePath);
            await classes.save();
            res.status(200).json({
                success: true,
                message: 'Video uploaded successfully',
                videofile: classes.videofile
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error uploading video'
        });
    }
});

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
