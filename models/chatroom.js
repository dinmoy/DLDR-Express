const { DataTypes } = require('sequelize');

const Chatroom = (sequalize) => {
    return sequalize.define('chatroom', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        teacher_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        student_user_id: {
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
            }
        },
        last_chat:{
            type:DataTypes.STRING(255),
            allowNull:false,
            references:{
                model:'message',
                key:'id',
            },
        },
    })
}

module.exports = Chatroom