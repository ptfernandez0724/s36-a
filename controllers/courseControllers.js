const Course = require('../models/course');

// creation of course

// 1. create a conditional statement that will check if the user is an admin
// 2. create a new course object using the mongoose model and the information from the request body and id from the header
// 23. save the new course to the database

module.exports.addCourse = (data) => {
    if(data.isAdmin){
        let newCourse = new Course({
            name: data.course.name,
            description: data.course.description,
            price: data.course.price
        });

        return newCourse.save().then((course, error) => {
            // course creation failed
            if(error){
                return false;
            } else {
                return true;
            }
        })

    } else {
        return false;
    }
}

// retrieve all courses

module.exports.getAllCourses = () => {
    return Course.find({}).then(result =>{
        return result;
    })
}

// retrieve all active courses

module.exports.getAllActive = () => {
    return Course.find({isActive:true}).then(result => {
        return result;
    })
}

// retrieve specific course

// module.exports.getSpecific = (data) => {
//     return Course.findOne({name:data.name}).then(result => {
//         return result;
//     })
// }

module.exports.getSpecific = (reqParams) => {
    return Course.findById(reqParams.courseId).then(result => {
        return result;
    })
}

// update a course
module.exports.updateCourse = (req) => {
    return Course.findByIdAndUpdate({ _id: req.params.courseId }, 
        {   name: req.body.name, 
            description: req.body.description, 
            price: req.body.price 
        })
    .then(updatedCourse => { 
        return (updatedCourse) 
            ? { message: "Course update was successful", data:updatedCourse} 
            : { message: "Course update failed" }; })
    .catch(error => res.status(500).send({message: "Internal Server Error"}))
}

// archive a course
module.exports.archiveCourse = (req) => {
    return Course.findByIdAndUpdate({ _id: req.params.courseId }, 
        {   isActive: false
        })
    .then(archivedCourse => { 
        return (archivedCourse) 
            ? { message: "Course archive was successful"} 
            : { message: "Course archive failed" }; })
    .catch(error => res.status(500).send({message: "Internal Server Error"}))
}