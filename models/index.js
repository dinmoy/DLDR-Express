const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = require('./user')(sequelize) 
const Subject = require('./subject')(sequelize) 
const Classes = require('./classes')(sequelize) 
const Curriculum = require('./curriculum')(sequelize) 
const Chatroom = require('./chatroom')(sequelize) 
const Message = require('./message')(sequelize) 
const Test = require('./test')(sequelize)
const Review = require('./review')(sequelize)

//모델 exports
module.exports = {
    User,
    Subject,
    Classes,
    Curriculum,
    Message,
    Chatroom,
    Message,
    Test,
    Review
} 
