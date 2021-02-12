const express = require('express');
require('dotenv').config()
const port = process.env.PORT || 4000;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
module.exports = io;

// cor
const cors = require('cors');

const corsOptions = require('./config/cors');
app.use(cors(corsOptions));

/////
require('dotenv').config();

/////
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect db
require('./config/database');

// routes
const authenticate = require('./src/middleware/auth.middleware');

app.use('/auth', require('./src/routes/auth.route'));
app.use('/user', authenticate, require('./src/routes/user.route'));

// socket
const socketServer = require('./src/controller/socket/socketServer');

io.on('connection', (socket) => {
    socketServer(socket)
});

/////
server.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
})




