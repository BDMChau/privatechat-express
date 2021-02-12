const messageModel = require('../../models/message.model');
const userModel = require('../../models/user.model');

const userMsg = require('../../utils/msgResponse/userMsg');

//////
const getMessage = (req, res) => {
    const { userId, selectedId, skipMessage, quantityMessage } = req.body;

    if (!userId || !selectedId || skipMessage < 0 || !quantityMessage) {
        return res.status(400).json({ err: 'Request failed!' })
    }

    messageModel.find({
        $or: [
            {
                $and: [
                    { from: userId },
                    { to: selectedId }
                ]
            }, {
                $and: [
                    { from: selectedId },
                    { to: userId }
                ]
            }
        ]
    })
        .sort({ _id: -1 })
        .skip(skipMessage)
        .limit(quantityMessage)
        .populate('from', 'socketid _id name avatar')
        .populate('to', 'socketid _id name avatar')
        .then((result) => {
            if (!result.length) {
                return res.status(200).json({ err: 'end conversation!' })
            }

            return res.status(200).json(result)
        })
        .catch((err) => {
            throw err;
        })
}

const getMessageListOnline = (req, res) => {
    userModel.find({
        $and: [
            { _id: { $ne: req.body.userId } },
            { online: 'Y' }
        ]
    })
        .select('-password')
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            throw err;
        })
}

const getMessageListOffline = (req, res) => {
    userModel.find({
        $and: [
            { _id: { $ne: req.body.userId } },
            { online: 'N' }
        ]
    })
        .select('-password')
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            throw err;
        })

}

const getProfile = (req, res) => {
    userModel.findOne({
        _id: req.body.userId
    })
        .select('-password')
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            throw err;
        })
}

const addAvatar = (req, res) => {
    userModel.findByIdAndUpdate(req.user._id, {
        $set: { avatar: req.body.avatar }
    }, {
        new: true,
        useFindAndModify: false
    })
        .select('-password')
        .exec((err, result) => {
            if (err) {
                console.log(err);
                return res.status(202).json({ err: userMsg.update_error })
            }
            return res.status(201).json({ msg: userMsg.update_success, avatar: result.avatar });
        })
}

const removeAvatar = (req, res) => {
    userModel.findByIdAndUpdate(req.user._id, {
        $unset: { avatar: 1 }
    }, {
        new: true,
        useFindAndModify: false
    })
        .select('-password')
        .exec((err, result) => {
            if (err) {
                return res.status(202).json({ err: userMsg.update_error })
            }

            return res.status(201).json({ msg: userMsg.update_success, avatar: result.avatar });
        })
}

const changeName = (req, res) => {
    const newName = req.body.newName.trim();
    const shortName = newName.split(/[\s,]+/)[newName.split(/[\s,]+/).length - 1];

    userModel.findByIdAndUpdate(req.user._id, {
        $set: {
            name: newName,
            shortname: shortName
        }
    }, {
        new: true,
        useFindAndModify: false
    })
        .exec((err, result) => {
            if (err) {
                console.log(err);
                return res.status(202).json({ err: userMsg.update_error });
            }
            return res.status(201).json({ msg: userMsg.update_success, name: result.name });
        })
}

const getLatestMessage = (req, res) => {
    messageModel.findOne({
        $or: [
            {
                $and: [
                    { from: req.body.userId },
                    { to: req.body.selectedId }
                ]
            }, {
                $and: [
                    { from: req.body.selectedId },
                    { to: req.body.userId }
                ]
            }
        ]
    })
        .sort({ _id: -1 })
        .limit(1)
        .populate('from', 'socketid _id shortname avatar')
        .populate('to', 'socketid _id shortname avatar')
        .then((result) => {
            if (!result) {
                return res.status(200).json({ err: 'nothing' });
            }

            return res.status(200).json(result);
        })
        .catch((err) => {
            throw err;
        })
}

const getSelectedProfile = (req, res) => {
    userModel.findOne({
        _id: req.body.selectedId
    })
        .select('-password')
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            throw err;
        })
}

module.exports = {
    getMessage,
    getMessageListOnline,
    getMessageListOffline,
    getProfile,
    addAvatar,
    removeAvatar,
    changeName,
    getLatestMessage,
    getSelectedProfile
}