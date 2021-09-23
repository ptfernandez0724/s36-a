const jwt = require('jsonwebtoken');
const user = require('./models/user');
// user defined string data that will be used to create our JSON web tokens. used in the algorithm for encrypting our data which makes it difficult to decode the information without the defined secret keyword

const secret = 'CourseBookingAPI';

// token creation
// analogy = create a package and provide a lock with the secret code as the key
module.exports.createAccessToken = (user) => {
    // the data will be recevied from the registration form. when the user logs in, a token will be created with the user's information

    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    // generate a JSON web token using the jswt's sign method (signature)

    return jwt.sign(data, secret, {})

}

// token verification
// analogy = receive the package and open the lock to verify if the sender is legitimate and the package was not tampered with

module.exports.verify = (req, res, next) => {
	//The token is retrieved from request header
	//This can be provided in postman under
		//Authorization > Bearer Token
	let token = req.headers.authorization;

	//Token received and is not undefined
	if(typeof token !== "undefined"){
		console.log(token);
		//The token that we receive is just like this:
			//"Bearer kdfidshfio7983utewjfiewoufosidfhndsnfieeyfouhdsjfndskjf"
		//The "slice" method takes only the token from the information sent via the request header
		//This removes the "Bearer " prefix and obtains only the token for verification
		token = token.slice(7, token.length);

		//Validate the token using the "verify" method decrypting the token using the secret code
		return jwt.verify(token, secret, (err, data) => {
			//if JWT is not valid
			if(err){
				return res.send( {auth: "failed"} )
			}else{
				//if JWT is valid
				//Allows the application to proceed with the next middleware function/callback function in the route
				//The next() middleware will be used to proceed to another function that invokes the controller function(business logic)
				next()
			}
		})
	}else{
		//Token does not exist
		return res.send({auth: "failed"});
	}
}

// token decryption
// analogy = open the package and get its contents

module.exports.decode = (token) => {

	//Token received and is not undefined
	if(typeof token !== "undefined"){

		//Retrieves only the token and removes the "Bearer " prefix
		token = token.slice(7, token.length);

		return jwt.verify(token, secret, (err, data) => {
			if(err){
				return null;
			}else{
				//The "decode" method is used to obtain the info from the JWT
				//{complet:true} option allows us to return additional info from the JWT token
				//Returns an object with access to the "payload" property which contains user information stored when the token was generated
				//The payload contains the info provided in the "createAccessToken" method defined above (id, email and isAdmin)
				return jwt.decode(token, {complete:true}).payload
			}
		})

		//Token does not exist
	}else{
		return null;
	}
}