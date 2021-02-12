const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    socketid: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    shortname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    online: {
        type: String
    },
    avatar: {
        type: String,
        default: null
    },
    resetToken: {
        type: String
    },
    expireToken: {
        type: Date
    },
    createdAt: {
        type: String
    }
});


const user = mongoose.model('User', userSchema);

module.exports = user;