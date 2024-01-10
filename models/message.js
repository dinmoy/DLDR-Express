const { DataTypes } = require('sequelize');

const Message = (sequalize) => {
    return sequalize.define('message', {
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
        chatroom_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'chatrooms',
                key: 'id',
            },
        },
        message: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    })
}

module.exports = Message