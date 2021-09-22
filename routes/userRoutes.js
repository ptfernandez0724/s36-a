const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');


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

router.post('/details', (req, res) => {
    userController.retrieveDetails(req.body).then(result => res.send(result));
});

module.exports = router;