// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./db');

const userRoute = require('./routes/user.route');
const defaultRoute = require('./routes/default.route');
const passwordRoute = require('./routes/reset_password'); 
const passwordRouteSecure = require('./routes/reset_password_secure'); 

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


const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    }
};

app.use(cors(corsOptions));

app.use('/user', userRoute);
app.use('/', defaultRoute);

app.use('/reset_password', passwordRoute); 
app.use('/reset_password_secure', passwordRouteSecure);  

let port = process.env.PORT || 4000;

const server = app.listen(port, function () {
    console.log('Listening on port ' + port);
});

