const { DataTypes } = require('sequelize')

const Favorite = (sequelize) => {
    return sequelize.define('favorite', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: true,
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
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'classes',
                key: 'id',
            },
        },
        is_deleted: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
};

module.exports = Favorite;