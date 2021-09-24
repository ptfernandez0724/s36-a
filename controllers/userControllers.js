const User = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../auth');
const Course = require('../models/course');

// check if the email already exists

// steps
// 1. use mongoose "find" method to find duplicate emails
// 2. use the "then" method to send a response back to the client based on the result of the find method

module.exports.checkEmailExists = (reqBody) => {
    return User.find({email: reqBody.email}).then(result => {
        // the "find" method returns a record if a match is found
        if(result.length > 0){
            return true;
        } else {
            // No duplicate email found. the user is not yet registered in the database
            return false;
        }
    })
}

// user registration
// steps
// 1. create a new user object using the mongoose model and information from the request body.
// 2. error handling, if error, return error. else, save the new user to the database

module.exports.registerUser = (reqBody) => {
    let newUser = new User({
        firstName: reqBody.firstName,
        lastName: reqBody.lastName,
        email: reqBody.email,
        mobileNo: reqBody.mobileNo,
        // 10 is the value provided as the number of "salt" rounds that the bcrypt algorithm will run in order to encrypt the password
        password: bcrypt.hashSync(reqBody.password, 10)
    })

    // saves the created object to our database
    return newUser.save().then((user, error) => {
        if (error){
            return false;          
        } else {
            return true;
        }
    })
}

// user authentication
// steps
// 1. check if email is existing in the database
// 2. check if info matches with the database (password)
// 3. generate/return a JSON web token if the user is successfully logged in, return false if error

module.exports.loginUser = (reqBody) => {
    return User.findOne({email: reqBody.email}).then(result => {
        if(result == null){
            return false
        } else {
            // create a variable "isPasswordCorrect" to return the result of comparing the login form password and the database password
            // "compareSync" method is used to compare a non-encrypted password from the login form to the encrypted password retrieved from the database and returns "true" or "false" value depending on the result
            // a good practive for boolean variable/constants is to use the word "is" or "are" at the beginning in the form of is+Noun

            const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password)
            // if the password matches with the one stored in the database, it will generate an access token
            if(isPasswordCorrect){
                // generate access token. use the "createAccessToken" method defined in the "auth.js" file
                // returning an object back to the frontend
                // we will use a mongoose method "toObject" to convert a mongoose object into a plain javascript object
                return {accessToken: auth.createAccessToken(result.toObject())}
            } else {
                // passwords do not match
                return false;
            }
        }
    })
}

module.exports.getProfile = (data) => {
	return User.findById( data.userId ).then(result => {
		// result.password = "";
        console.log(data);
		return result;

	})
}

// enroll a user to a class/course
// async await will be used to enroll the user
module.exports.enroll = async (data) => {
    let isUserUpdated = await User.findById(data.userId).then(user => {
        user.enrollments.push({courseId: data.courseId})

    // save the updated user information in the database
    return user.save().then((user, error) => {
        if(error){
            return false;
        } else {
            return true;
        }
    })
})

    let isCourseUpdated = await Course.findById(data.courseId).then(course => {
        course.enrollees.push({userId: data.userId});

        return course.save().then((course, error) => {
            if(error) {
                return false;
            } else {
                return true;
            }
        })
    })
    if(isUserUpdated && isCourseUpdated){
        return true;
    } else {
        return false;
    }
}
