const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = new mongoose.Schema({
    message: {
        type: String
    },
    images: {
        type: String
    },
    sticker: {
        type: String
    },
    from: {
        type: ObjectId,
        ref: 'User'
    },
    to: {
        type: ObjectId,
        ref: 'User'
    },
    time:{
        type: String
    },
    createdAt:{
        type: String
    }
});


const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;