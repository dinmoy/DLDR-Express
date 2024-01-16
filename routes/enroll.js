const express = require('express')
const { EnrolledClasses, Classes } = require('../models')

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { user_id, class_id } = req.body;
        const enrolledClass = await EnrolledClasses.create({
            user_id,
            class_id,
            is_deleted: 0
        });
        res.status(201).json(enrolledClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error enrolling class' });
    }
});

router.delete('/:id',async(req,res)=>{
    try{
        const enrolledClass=req.params.id;
        const deletedEnroll=await Classes.destroy({where: {id: enrolledClass}});
        if(deletedEnroll){
            res.status(200).json({sucess: true, message: 'enrolled Class deleted successfully'});
        }else{
            res.status(404).json({success:false,message:'enrolledvClass not found'});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({success: false,message: 'Error deleting enrolledClass'});
    }
})


// 하나의 커리큘럼 삭제
router.delete('/:id', async (req, res) => {
    try {
        const curriculumId = req.params.id;

        // 커리큘럼 삭제
        const deletedCurriculum = await Curriculum.destroy({ where: { id: curriculumId } });

        if (deletedCurriculum) {
            res.status(200).json({ success: true, message: 'Curriculum deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Curriculum not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting curriculum' });
    }
});

module.exports = router;