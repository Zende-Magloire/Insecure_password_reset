const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: String,
    first_name: String,
    last_name: String,
    email: String,
    role: String,
    password: String,
    resethash: String // Add a field for the reset hash
}, {
    collection: 'user'
});

module.exports = mongoose.model('User', UserSchema);

