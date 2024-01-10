const express = require('express')
const sequelize = require('./config/database')
const app = express()
const port = 3000

// routes
const userRouter = require('./routes/user') // Adjust the path as needed
const classRouter = require('./routes/classes')
const curriculumRouter = require('./routes/curriculum')
const reviewRouter = require('./routes/review')
const authRouter = require('./routes/auth')

app.get('/', (req, res) => {
    res.send('Do Learn! Do Run!')
})

// middlewares
app.use(express.json())

// router
app.use('/users', userRouter)
app.use('/classes', classRouter)
app.use('/curriculums', curriculumRouter)
app.use('/reviews', reviewRouter)
app.use('/auth', authRouter)


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



