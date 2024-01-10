const { DataTypes } = require('sequelize');


const Subject = (sequelize) => {
    return sequelize.define('subject', {
        id: {
            type: DataTypes.INTEGER,
            primarykey: true,
            allowNull: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    });
};

module.exports = Subject;
