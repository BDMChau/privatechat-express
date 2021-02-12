import io from 'socket.io-client';
import { endDomain } from '../config/Api';

const socket = io(endDomain);

const updateSocketId = (userId) => {
    socket.emit("updateSocketId", userId);
}

// const getChatListSocket = (userId) => {
//     socket.emit("getChatList", userId);
// }

const sendMessageSocket = (message, conversationData) => {
    socket.emit('sendMessage', message, conversationData);
}

const sendImageSocket = (imageUrl, conversationData) => {
    socket.emit('sendImage', imageUrl, conversationData);
}

const sendStickerSocket = (stickerUrl, conversationData) => {
    socket.emit('sendSticker', stickerUrl, conversationData);
}

export {
    socket,
    updateSocketId,
    sendMessageSocket,
    sendImageSocket,
    sendStickerSocket
}

