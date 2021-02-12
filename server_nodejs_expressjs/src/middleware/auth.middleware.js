const keys = require('../../config/keys');
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model');

const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.json({ err: "You have to log in first!" })
    }

    const token = req.headers.authorization;

    jwt.verify(token, keys.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.json({ err: "You have to log in first!" })
        }

        userModel.findOne({
            _id: payload
        })
            .then((userData) => {
                req.user = userData;
                next();
            })
            .catch((err) => {
                console.log(err);
            })
    })
}

module.exports = auth;