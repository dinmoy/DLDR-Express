const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize);
const Subject = require('./subject')(sequelize);
const Classes = require('./classes')(sequelize);
const Curriculum =require('./curriculum')(sequelize);

//모델 exports
module.exports = {
    User,
    Subject,
    Classes,
    Curriculum,
};
