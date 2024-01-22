const express = require('express')
const { EnrolledClasses, Classes, Chatroom } = require('../models')

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const enrolledClasses = await EnrolledClasses.findAll({
            where: {
                user_id: userId
            }
        })
        const allClasses = await Classes.findAll()
        const enrollStatus = allClasses.map(oneClass => {
            const isEnrolled = enrolledClasses.some(enroll => enroll.class_id === oneClass.id);
            return {
                ...oneClass.dataValues,
                isEnrolled: isEnrolled ? true : false,
            };
        });
        return res.status(200).json(enrollStatus);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error reading class with enrollstatus' })
    }
});

router.post('/', async (req, res) => {
    try {
        const { user_id, class_id } = req.body;
        const oneClass = await Classes.findByPk(class_id);
        const enrolledClass = await EnrolledClasses.create({
            user_id,
            class_id,
            is_deleted: 0
        });
        const chatRoom = await Chatroom.create({
            teacher_user_id: oneClass.user_id,
            student_user_id: user_id,
            class_id: class_id
        });
        await enrolledClass.update(chatRoom);
        return res.status(201).json(enrolledClass);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error enrolling class' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const enrolledClass = req.params.id;
        const deletedEnroll = await Classes.destroy({ where: { id: enrolledClass } });
        if (deletedEnroll) {
            res.status(200).json({ sucess: true, message: 'enrolled Class deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'enrolledvClass not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error deleting enrolledClass' });
    }
})


// 하나의 커리큘럼 삭제
router.delete('/:id', async (req, res) => {
    try {
        const curriculumId = req.params.id;

        // 커리큘럼 삭제
        const deletedCurriculum = await Curriculum.destroy({ where: { id: curriculumId } });

        if (deletedCurriculum) {
            res.status(200).json({ success: true, message: 'Curriculum deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Curriculum not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting curriculum' });
    }
});

module.exports = router;