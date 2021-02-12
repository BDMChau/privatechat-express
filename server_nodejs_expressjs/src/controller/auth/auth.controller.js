const bcryptjs = require('bcryptjs');
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');
const cryptojs = require('crypto-js')

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const dayjs = require('dayjs');
const userModel = require('../../models/user.model');

const authMsg = require('../../utils/msgResponse/authMsg');

//////
const mailer = nodemailer.createTransport(sgTransport({
    auth: { api_key: keys.SENDGRID_KEY }
}))

//////
const signUp = (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ err: authMsg.signUpFields_missing })
    }

    const password = req.body.password;
    const name = req.body.name.trim();
    const email = req.body.email.trim();

    userModel.findOne({
        email: email
    })
        .then((user) => {
            if (user) {
                return res.status(202).json({ err: authMsg.emailExist_true })
            }


            const shortName = name.split(/[\s,]+/)[name.split(/[\s,]+/).length - 1];
            const decryptedPass = cryptojs.AES.decrypt(password, 'secretKey');
            const originalPass = decryptedPass.toString(cryptojs.enc.Utf8);

            bcryptjs.hash(originalPass, 8)
                .then((hashedPassword) => {
                    const newUser = new userModel({
                        name: name,
                        shortname: shortName,
                        email: email,
                        password: hashedPassword,
                        online: 'N',
                        createdAt: dayjs().format("MMM D, YYYY h:mm a")
                    })
                    newUser.save()
                        .then((result) => {
                            mailer.sendMail({
                                to: result.email,
                                from: "awesomechat105@gmail.com",
                                subject: "Welcome",
                                html: "<h1>Welcome to my Chat App!</h1>"
                            })

                            res.status(200).json({
                                msg: authMsg.signUpMessage_success1,
                                msg2: authMsg.signUpMessage_success2
                            })
                        })
                        .catch((err) => {
                            throw err;
                        })
                })

        })
        .catch((err) => {
            throw err;
        })
}

const signIn = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ err: authMsg.credential_error })
    }

    const password = req.body.password;
    const email = req.body.email.trim();

    userModel.findOne({
        email: email
    })
        .then((user) => {
            if (!user) {
                return res.status(202).json({ err: authMsg.userExist_error })
            }

            const decryptedPass = cryptojs.AES.decrypt(password, 'secretKey');
            const originalPass = decryptedPass.toString(cryptojs.enc.Utf8);

            bcryptjs.compare(originalPass, user.password)
                .then((isMatch) => {
                    if (!isMatch) {
                        return res.status(202).json({ err: authMsg.matchingPass_error })
                    }

                    const userToken = jwt.sign({ _id: user._id }, keys.JWT_SECRET, { algorithm: 'HS256' });

                    // Dont send password to client
                    const { _id, socketid, name, email, avatar } = user;
                    res.status(200).json({
                        userToken,
                        user: { _id, socketid, name, email, avatar },
                        msg: authMsg.login_success
                    });
                })
                .catch((err) => {
                    throw err;
                })
        })
        .catch((err) => {
            throw err;
        })
}

const userValid = (req, res) => {
    const userId = req.body.id;
    const updateObj = { online: 'Y' };

    if (userId) {
        userModel.findByIdAndUpdate(userId, updateObj, {
            new: true,
            useFindAndModify: false
        }, (err, result) => {
            if (err) {
                return res.status(400).json({ err: authMsg.login_error })
            }

            const { _id, socketid, name, email, avatar } = result;
            return res.status(200).json({ user: { _id, socketid, name, email, avatar } });
        })
    } else {
        return res.status(400).json({ err: authMsg.login_error });
    }
}

const signOut = (req, res) => {
    const { userId } = req.body;
    const updateObj = { online: 'N' };

    if (userId) {
        userModel.findByIdAndUpdate(userId, updateObj, {
            new: true,
            useFindAndModify: false
        }, (err, result) => {
            if (err) {
                return res.status(400).json({ msg: authMsg.signOut_error })
            }

            return res.status(200).json({ msg: authMsg.signOut_success })
        })
    } else {
        return res.status(400).json({ msg: authMsg.userIdExist_error })
    }
}

const sendEmail = (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({ err: authMsg.credential_error })
    }

    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            throw err;
        }
        const token = buffer.toString("hex");

        userModel.findOne({ email: email })
            .exec((err, user) => {
                if (err) {
                    throw err;
                }

                if (!user) {
                    return res.status(400).json({ err: authMsg.userExist_error })
                }

                user.resetToken = token;
                user.expireToken = Date.now() + 1800000; //30 minutes
                user.save()
                    .then((result) => {
                        mailer.sendMail({
                            to: result.email,
                            from: "awesomechat105@gmail.com",
                            subject: "Reset password!",
                            html: `
                                <h3>Welcome to my Chat App</h3>
                                <h4>A request to reset your password has been made. Click the link below to reset your password:</h4>
                                <h2><a href="http://localhost:3000/resetpass/${token}">Link</a></h2>
                                <br/>
                                <p>If you did not make this request, simply ignore this email.</p>
                                <h4>Your request will be expired in 30 minutes.</h4>
                            `
                        })

                        return res.status(201).json({ msg: authMsg.mailSent_success });
                    })
                    .catch((err) => {
                        throw err
                    })

            })
    })
}

const resetPass = (req, res) => {
    if (!req.body.password || !req.body.tokenResetPassword) {
        return res.status(400).json({ err: authMsg.credential_error })
    }

    const newPassword = req.body.password;
    const token = req.body.tokenResetPassword;

    userModel.findOne({
        resetToken: token,
        expireToken: { $gt: Date.now() } // check expire 
    })
        .exec((err, user) => {
            if (err) {
                throw err;
            }

            if (!user) {
                return res.status(202).json({ err: authMsg.resetPass_expired })
            }

            const decryptedPass = cryptojs.AES.decrypt(newPassword, 'secretKey');
            const originalPass = decryptedPass.toString(cryptojs.enc.Utf8);

            bcryptjs.hash(originalPass, 8)
                .then((hashedPassword) => {
                    user.password = hashedPassword;
                    user.tokenReset = undefined;
                    user.expireToken = undefined;

                    user.save()
                        .then((user) => {
                            res.status(201).json({ msg: authMsg.resetPass_success })
                        })
                        .catch((err) => {
                            throw err;
                        })
                })
                .catch((err) => {
                    throw err;
                })
        })
}

module.exports = {
    signUp,
    signIn,
    userValid,
    signOut,
    sendEmail,
    resetPass,
}



