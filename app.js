const express = require('express')
const session = require('express-session');
const sequelize = require('./config/database')
const app = express()
const path = require('path')
const port = 3000

// 세션
const SEC = 1000;
const HOUR = 60 * 60 * SEC;

// routes
const userRouter = require('./routes/user') // Adjust the path as needed
const classRouter = require('./routes/classes')
const curriculumRouter = require('./routes/curriculum')
const reviewRouter = require('./routes/review')
const authRouter = require('./routes/auth')
const favoriteRouter = require('./routes/favorite')
const chatroomRouter = require('./routes/chatroom')
const messageRouter = require('./routes/message')
const enrollRouter = require('./routes/enroll')
const watchHistoryRouter = require('./routes/watch_history')
const subjectRouter = require('./routes/subject')
const testRouter=require('./routes/test')
app.get('/', (req, res) => {
    res.send('Do Learn! Do Run!')
})

// 미들웨어
app.use(express.json())
app.use(express.static(path.join(__dirname, '/')))


// 세션 미들웨어 초기화
app.use(
    session({
        secret: 'secret-key', // 세션 암호화를 위한 키
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: HOUR,
        },
    })
);


// router
app.use('/users', userRouter)
app.use('/classes', classRouter)
app.use('/curriculums', curriculumRouter)
app.use('/reviews', reviewRouter)
app.use('/auth', authRouter)
app.use('/favorites', favoriteRouter)
app.use('/chatrooms', chatroomRouter)
app.use('/messages', messageRouter)
app.use('/enroll', enrollRouter)
app.use('/watch_histories', watchHistoryRouter)
app.use('/subjects', subjectRouter)
app.use('/tests',testRouter)

// sequalize
sequelize.sync()
    .then(() => {
        console.log('Database synced')
    })
    .catch((err) => {
        console.error('Error syncing database:', err)
    });


app.get('/', (req, res) => {
    res.send('Do Learn! Do Run!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port} `)
})



