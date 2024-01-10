const { DataTypes, INTEGER } = require('sequelize')

const Classes = (sequelize) => {
    return sequelize.define('classes', {
        id: {
            type: DataTypes.INTEGER,
            primarykey: true,
            allowNull: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subject',
                key: 'id',
            },
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
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        is_deleted: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });
};

module.exports = Classes;