// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./db');

const userRoute = require('./routes/user.route');
const defaultRoute = require('./routes/default.route');
const passwordRoute = require('./routes/reset_password'); // Include the new route

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => { console.log('Database is connected'); },
    err => { console.log('DB error: ' + err); }
);

const app = express();


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('static'));
app.set('view engine', 'pug');

// Define the CORS options object
const corsOptions = {
    origin: function (origin, callback) {
        // Add your CORS logic here
        callback(null, true); // Enable all origins as an example
    }
};

app.use(cors(corsOptions)); // Use CORS middleware with the defined options

app.use('/user', userRoute);
app.use('/', defaultRoute);

app.use('/reset_password', passwordRoute); // Mount the new route

let port = process.env.PORT || 4000;

const server = app.listen(port, function () {
    console.log('Listening on port ' + port);
});

