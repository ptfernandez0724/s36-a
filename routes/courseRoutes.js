const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseControllers');
const auth = require('../auth');
const { addListener } = require('../models/course');

// route for creating a course
// localhost:4000/courses/
router.post('/', auth.verify, (req, res) => {
    const data = {
        course: req.body,
        isAdmin: auth.decode(req.headers.authorization).isAdmin
    }
    courseController.addCourse(data).then(result => res.send(result));
});

router.get('/all', (req, res) => {
    courseController.getAllCourses().then(result => res.send(result));
})

// retrieve all active courses
router.get('/', (req, res) => {
    courseController.getAllActive().then(result => res.send(result));
}) 

// retrieve specific course
// router.get('/one', (req, res) => {
//     courseController.getSpecific(req.body).then(result => res.send(result));
// }) 

router.get('/:courseId', (req, res) => {
    courseController.getSpecific(req.params).then(result => res.send(result));
})

// update a course

router.put('/:courseId', auth.verify, (req, res) => {
    const data = {
        isAdmin: auth.decode(req.headers.authorization).isAdmin
    }

    if (data.isAdmin) {
        courseController.updateCourse(req).then(result => res.send(result));
    } else {
        res.send(false)
    }
})

// archive a course/soft delete a course
router.put('/:courseId/archive', auth.verify, (req, res) => {
    const data = {
        isAdmin: auth.decode(req.headers.authorization).isAdmin
    }

    if(data.isAdmin){
        courseController.archiveCourse(req).then(result => res.send(result))
    } else {
        res.send(false)
    }
})




module.exports = router;