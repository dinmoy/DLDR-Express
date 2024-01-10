const { DataTypes } = require('sequelize');


const Subject = (sequelize) => {
    return sequelize.define('subject', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    });
};

module.exports = Subject;
