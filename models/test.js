const { DataTypes } = require('sequelize')

const Test = (sequelize) => {
    return sequelize.define('test', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        curriculum_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        question_type: {
            type: DataTypes.STRING(20), // multi, single
            allowNull: false
        },
        question: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        answer: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        wrong1: {
            type: DataTypes.STRING(255)
        },
        wrong2: {
            type: DataTypes.STRING(255)
        },
        wrong3: {
            type: DataTypes.STRING(255)
        },
    })
}

module.exports = Test;