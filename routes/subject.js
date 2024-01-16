const express = require('express')
const { Subject, Classes } = require('../models')// user model

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const subjects=await Subject.findAll();

        const subjectsWithClassCount=await Promise.all(subjects.map(async subject =>{
            const classCount=await Classes.count({
                where:{
                    subject_id:subject.id
                }
            });
            return {
                ...subject.dataValues,
                classCount: classCount
            };
        }));    

        return res.status(200).json(subjectsWithClassCount);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error reading ChatRoom\'s messages')
    }
})

module.exports = router;
