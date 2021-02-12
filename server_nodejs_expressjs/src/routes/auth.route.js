const express = require('express');
const route = express.Router();
const authController = require('../controller/auth/auth.controller')

//////
route.post('/signup', authController.signUp);

route.post('/signin', authController.signIn);

route.post('/uservalid', authController.userValid);

route.post('/signout', authController.signOut);

route.post('/sendemail', authController.sendEmail);

route.post('/resetpass', authController.resetPass);


module.exports = route;