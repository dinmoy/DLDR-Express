const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models'); // user model

const router = express.Router();

const SALT = 10;

// 회원가입
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, birth, profile_img, user_type } = req.body;
        console.log(req.body);

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, SALT);

        // 사용자 생성
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword
        });

        req.session.user = newUser;
        console.log(req.session.user);

        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error creating user' });
    }
});

// 로그인
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 이메일로 사용자 찾기
        const user = await User.findOne({ where: { email } });

        if (user) {
            // 비밀번호 비교
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                req.session.user = user; // 로그인 성공 시 세션에 사용자 정보 저장

                console.log(req.session.user);
                return res.status(200).json(user);
            }
        }

        return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error logging in' });
    }
});

module.exports = router;