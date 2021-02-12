const express = require('express');
const route = express.Router();
const userController = require('../controller/user/user.controller')
const userModel = require('../models/user.model');


route.post('/message', userController.getMessage);

route.post('/messagelistonline', userController.getMessageListOnline);

route.post('/messagelistoffline', userController.getMessageListOffline);

route.post('/profile', userController.getProfile);

route.post('/latestmessage', userController.getLatestMessage);

route.post('/selectedprofile', userController.getSelectedProfile);

route.patch('/addavatar', userController.addAvatar);

route.patch('/removeavatar', userController.removeAvatar);

route.patch('/changename', userController.changeName);

route.post('/updateUserSendAndRecieve', async (req, res) => {
    try {
        const { userId, selectedId } = req.body;

        const user = await userModel.findById(userId);
        const userSelected = await userModel.findById(selectedId);

        if(!user || !userSelected){
            res.status(202).json({err:"user does not exist!"});
            return;
        }
        
        delete user.password;
        delete userSelected.password;

        res.status(200).json({user, userSelected});
        return;
    } catch (error) {
        throw error;
    }

})

module.exports = route;