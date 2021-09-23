const express = require('express');
const mongoose = require('mongoose');
// allows our backend to be available to our frontend application. it allows us to  control app's cross origin resource sharing settings
const cors = require ('cors');

// allow access to routes defined within our application
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes')

const app = express();

// connect to mongoDB database
mongoose.connect('mongodb+srv://admin:admin@zuitt-bootcamp.kc9re.mongodb.net/Batch127_Booking?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// prompts the message in the terminal once the connection is 'open' and we are able to successfuly connect to our database
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'))

// allows all resources/origins to access our backend application
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// '/users' to be included  or all user routes defined in the 'userRoutes' file
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);


// Will use the defined port number for the application whenever an environment variable is available OR will use port 4000 if none is defined
// this syntax will allow flexibility when using the application locally or as a hosted application
app.listen(process.env.PORT || 4000, () => {
    console.log(`API is now online on port ${process.env.PORT || 4000}`);
});