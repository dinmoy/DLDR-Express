const { DataTypes } = require('sequelize');

const WatchHistories = (sequelize) => {
    return sequelize.define('watch_histories', {
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
        curriculum_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'curriculums',
                key: 'id',
            },
        }
    });
};

module.exports = WatchHistories;