const express = require('express');
const { Test } = require('../models');

const router = express.Router();

router.post('/', async (req, res) => {
    try{
        const {curriculum_id,question_type,question,answer,wrong1,wrong2,wrong3}=req.body;
        const newTest=await Test.create({
            curriculum_id,
            question_type,
            question,
            answer,
            wrong1,
            wrong2,
            wrong3,
        });
        return res.status(201).json(newTest);
    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'Error creating test'});
    }
});

module.exports = router;