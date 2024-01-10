const { DataTypes } = require('sequelize')

const Curriculum = (sequelize) => {
    return sequelize.define('curriculum', {
        id: {
            type: DataTypes.INTEGER,
            primarykry: true,
            allowNull: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        step: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        video: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        document: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    });
};

module.exports = Curriculum