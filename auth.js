const jwt = require('jsonwebtoken');
const user = require('./models/user');
// user defined string data that will be used to create our JSON web tokens. used in the algorithm for encrypting our data which makes it difficult to decode the information without the defined secret keyword

const secret = 'CourseBookingAPI';

// token creation
// analogy = pack the gift and provide a lock with the secret code as the key
module.exports.createAccessToken = () => {
    // the data will be recevied from the registration form. when the user logs in, a token will be created with the user's information

    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    // generate a JSON web token using the jswt's sign method (signature)

    return jwt.sign(data, secret, {})

}
