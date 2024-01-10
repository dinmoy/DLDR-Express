const express = require('express');
const { Curriculum } = require('../models');

const router = express.Router();

// 커리큘럼 생성 엔드포인트
router.post('/', async (req, res) => {
    try {
        const { user_id, class_id, name, introduction, step, video, document } = req.body;

        // 커리큘럼 생성
        const newCurriculum = await Curriculum.create({
            user_id,
            class_id,
            name,
            introduction,
            step,
            video,
            document,
        });

        res.status(201).json(newCurriculum);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error creating curriculum' });
    }
});

// 특정 커리큘럼 업데이트
router.put('/:id', async (req, res) => {
    try {
        const curriculumId = req.params.id;
        const { name, step, video, document } = req.body;

        // 커리큘럼 업데이트
        const updatedCurriculum = await Curriculum.update(
            { name, step, video, document },
            { where: { id: curriculumId } }
        );

        res.status(200).json(updatedCurriculum);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating curriculum' });
    }
});

// 하나의 커리큘럼 조회
router.get('/:id', async (req, res) => {
    try {
        const curriculumId = req.params.id;

        // 특정 커리큘럼 조회
        const curriculum = await Curriculum.findByPk(curriculumId);

        if (curriculum) {
            res.status(200).json(curriculum);
        } else {
            res.status(404).json({ success: false, message: 'Curriculum not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching curriculum' });
    }
});

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


// 특정 커리큘럼 업데이트
router.put('/:id', async (req, res) => {
    try {
        const curriculumId = req.params.id;
        const { name, step, video, document } = req.body;

        // 커리큘럼 업데이트
        const updatedCurriculum = await Curriculum.update(
            { name, step, video, document },
            { where: { id: curriculumId } }
        );

        res.status(200).json({ success: true, curriculum: updatedCurriculum });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating curriculum' });
    }
});

// 하나의 커리큘럼 조회
router.get('/:id', async (req, res) => {
    try {
        const curriculumId = req.params.id;

        // 특정 커리큘럼 조회
        const curriculum = await Curriculum.findByPk(curriculumId);

        if (curriculum) {
            res.status(200).json({ success: true, curriculum });
        } else {
            res.status(404).json({ success: false, message: 'Curriculum not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching curriculum' });
    }
});

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
