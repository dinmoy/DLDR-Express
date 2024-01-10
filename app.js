const express = require('express')
const sequelize = require('./config/database')
const app = express()
const port = 3000

// routes
const userRouter = require('./routes/user') // Adjust the path as needed
app.get('/', (req, res) => {
    res.send('Do Learn! Do Run!')
})

const classRouter=require('./routes/classes')
app.get('/',(req,res)=>{
    res.send('Do Learn! Do Run!')
})

// middlewares
app.use(express.json())

// router
app.use('/users', userRouter)
app.use('/classes',classRouter)

// sequalize
sequelize.sync()
    .then(() => {
        console.log('Database synced')
    })
    .catch((err) => {
        console.error('Error syncing database:', err)
    });


app.listen(port, () => {
    console.log(`Example app listening on port ${port} `)
})



