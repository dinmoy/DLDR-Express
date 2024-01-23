const { DataTypes, INTEGER } = require('sequelize');

const Classes = (sequelize) => {
    return sequelize.define('classes', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subjects',
                key: 'id',
            },
        },
        sub_title: {
            type: DataTypes.STRING(20),
            allowNull:false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        introduction: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        thumbnail: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        is_deleted: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });
};

module.exports = Classes;