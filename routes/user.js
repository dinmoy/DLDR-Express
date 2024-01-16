const express = require('express')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const {User, Classes, Favorite, Chatroom, EnrolledClasses, WatchHistories, Curriculum} = require('../models')// user model

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

        const foundClasses = await Promise.all(classPromises);

        // 클래스에 해당하는 유저 찾기
        const userPromises = foundClasses.map(async oneClass => {
            return await User.findOne({
                where: {
                    id: oneClass.user_id
                }
            })
        })

        // 유저 데이터로 만들기 (배열)
        const users = await Promise.all(userPromises)

        // teacher라는 칼럼 추가 ]
        const result = foundClasses.map((el, index) => {
            return {
                ...el.dataValues,
                teacher: users[index]
            }
        })

        return res.status(200).json(result);
    } catch (error) {
        console.log(error)
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