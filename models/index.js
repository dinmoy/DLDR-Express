const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize);

// 모델 exports
module.exports = {
    User,
    // 모델 추가
};
