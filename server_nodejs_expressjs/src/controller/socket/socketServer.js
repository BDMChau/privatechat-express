const userModel = require('../../models/user.model');
const messageModel = require('../../models/message.model');
const io = require('../../../server');
const dayjs = require('dayjs');


const socketServer = (socket) => {
    //////
    console.log(socket.id + ": connected");

    socket.on('disconnect', () => {
        console.log(socket.id + ": disconnect");
    })

    //////
    socket.on('updateSocketId', (userId) => {
        const updateObj = { socketid: socket.id };

        userModel.findByIdAndUpdate(userId, updateObj, {
            new: true,
            useFindAndModify: false
        })
            .exec((err, result) => {
                if (err) {
                    throw err;
                }

                return;
            })
    })

    //////
    socket.on("sendMessage", async (message, conversationData) => {
        const time = dayjs().format('h:mm a');
        const createdAt = dayjs().format("MMM D, YYYY h:mm a");
        const { user, userSelected } = conversationData;


        const dataResponse = {
            from: user,
            to: userSelected,
            time,
            message
        }
        io.to(`${user.socketid}`).emit("newMessage", dataResponse);
        io.to(`${userSelected.socketid}`).emit("newMessage", dataResponse);


        const dataSaveToDB = {
            message: message,
            from: user._id,
            to: userSelected._id,
            time: time,
            createdAt: createdAt
        }
        new messageModel(dataSaveToDB).save();
        return;

    })

    //////
    socket.on("sendImage", async (imageUrl, conversationData) => {
        const time = dayjs().format('h:mm a');
        const createdAt = dayjs().format("MMM D, YYYY h:mm a");
        const { user, userSelected } = conversationData;

        const dataResponse = {
            from: user,
            to: userSelected,
            time,
            images: imageUrl,
        }
        io.to(`${user.socketid}`).emit("newMessage", dataResponse);
        io.to(`${userSelected.socketid}`).emit("newMessage", dataResponse);


        const dataSaveToDB = {
            images: imageUrl,
            from: user._id,
            to: userSelected._id,
            time: time,
            createdAt: createdAt
        }
        new messageModel(dataSaveToDB).save();
        return;
    })

    //////
    socket.on("sendSticker", async (stickerUrl, conversationData) => {
        const time = dayjs().format('h:mm a');
        const createdAt = dayjs().format("MMM D, YYYY h:mm a");
        const { user, userSelected } = conversationData;

        const dataResponse = {
            from: user,
            to: userSelected,
            time,
            sticker: stickerUrl
        }
        io.to(`${user.socketid}`).emit("newMessage", dataResponse);
        io.to(`${userSelected.socketid}`).emit("newMessage", dataResponse);


        const dataSaveToDB = {
            sticker: stickerUrl,
            from: user._id,
            to: userSelected._id,
            time: time,
            createdAt: createdAt
        }
        new messageModel(dataSaveToDB).save();
        return;
    })

}

module.exports = socketServer