const express = require('express');
const { Review } = require('../models');

const router = express.Router();

// 리뷰 생성 엔드포인트
router.post('/', async (req, res) => {
    try {
        const { user_id, class_id, content, stars } = req.body;

        // 리뷰 생성
        const newReview = await Review.create({
            user_id,
            class_id,
            content,
            stars,
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error creating review' });
    }
});

// 특정 리뷰 조회 엔드포인트
router.get('/:id', async (req, res) => {
    try {
        const reviewId = req.params.id;

        // 특정 리뷰 조회
        const review = await Review.findByPk(reviewId);

        if (review) {
            res.status(200).json(review);
        } else {
            res.status(404).json({ success: false, message: 'Review not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching review' });
    }
});

// 리뷰 수정 엔드포인트
router.put('/:id', async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { content, stars } = req.body;

        // 리뷰 업데이트
        const updatedReview = await Review.update(
            { content, stars },
            { where: { id: reviewId } }
        );

        res.status(200).json({ success: true, review: updatedReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating review' });
    }
});

// 리뷰 삭제 엔드포인트
router.delete('/:id', async (req, res) => {
    try {
        const reviewId = req.params.id;

        // 리뷰 삭제
        const deletedReview = await Review.destroy({ where: { id: reviewId } });

        if (deletedReview) {
            res.status(200).json({ success: true, message: 'Review deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Review not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting review' });
    }
});

module.exports = router;
