const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const auth = require('../auth');


// route for checking if the user's email already exists in the database
router.post('/checkEmail', (req, res) => {
    userController.checkEmailExists(req.body).then(result => res.send(result));
});

// route for user registration
router.post('/register', (req, res) => {
    userController.registerUser(req.body).then(result => res.send(result));
});

// route for user authentication
router.post('/login', (req, res) => {
    userController.loginUser(req.body).then(result => res.send(result));
});

router.get('/details', auth.verify, (req, res) => {
    // uses the decode method in the auth.js to retrieve the user info from the token passing the "token" from the request header as an argument
    const userData = auth.decode(req.headers.authorization);
    userController.getProfile({userId: userData.id}).then(result => res.send(result));
});

// routes to enroll a user to a course
router.post('/enroll', auth.verify, (req, res) => {
    let data = {
        userId: auth.decode(req.headers.authorization).id,
        courseId: req.body.courseId
    }
    userController.enroll(data).then(result => res.send(result))
})

module.exports = router;