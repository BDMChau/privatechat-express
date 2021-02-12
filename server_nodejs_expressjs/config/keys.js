require('dotenv').config()

const keys = {
    MONGOURI: process.env.MONGOURI,
    JWT_SECRET: process.env.JWT_SECRET,
    SENDGRID_KEY: process.env.SENDGRID_KEY
}

module.exports = keys;