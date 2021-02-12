const mongoose = require('mongoose');
const keys = require('./keys');

mongoose.connect(keys.MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
    console.log(`CONNECTED DATABASE`);
})

mongoose.connection.on('error', (err) => {
    console.log(`CANNOT CONNECT TO DATABASE:`, err);
})

