const express = require('express')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {User, Classes} = require('../models')// user model

const router = express.Router();

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/profiles');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}_${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({storage});

// 프로필 이미지 업로드 라우트
router.post('/upload', upload.single('profileImage'), async (req, res) => {
    try {
        // 업로드된 파일 정보
        const {filename, path: filePath} = req.file;

        // 사용자 모델 업데이트
        const userId = req.body.userId; // 이 부분은 실제 사용자 ID를 전달해야 합니다.
        const user = await User.findByPk(userId);
        if (user) {
            user.profile_img = path.relative(path.join(__dirname, '..'), filePath);
            await user.save();
            res.status(200).json({
                success: true,
                message: 'Profile image uploaded successfully',
                profile_img: user.profile_img
            });
        } else {
            res.status(404).json({success: false, message: 'User not found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'Error uploading profile image'});
    }
});

// 모든 유저 조회하기
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({error: 'Error fetching users'});
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

// 유저의 클래스 조회하기
router.get('/:id/classes', async (req, res) => {
    const userId = req.params.id;

    try {
        // TODO: 유저가 학생일 때

        // 유저가 선생님일 때
        const classes = await Classes.findAll({where: {user_id: userId}})
        return res.status(200).json(classes);
    } catch (error) {
        return res.status(500).json({error: 'Error finding classes'})
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
