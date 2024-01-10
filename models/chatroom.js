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
        // TODO: class_id 추가하기
    })
}

module.exports = Chatroom