const User = require('../models/user');
const Chat = require('../models/chat');
const Message = require('../models/message');
const express = require('express');
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const { body, check, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const { generateToken, verifyToken } = require('../middleware/middleware');

exports.user_list = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const authorizedUser = verifyToken(token);
    console.log(authorizedUser.user.username);

    // const allUsers = await User.find({}, "username, profile_picture").populate('username').exec();
    const allUsers = await User.find({ username: { $ne: authorizedUser.user.username } }).select( "-password -chats -friends").populate('username').exec();
    res.json(allUsers);
})

exports.new_message = [
    body('text', 'The text must be between 1 and 1000 characters')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .escape(),
    
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const token = req.headers.authorization.split(' ')[1];
            const authorizedUser = verifyToken(token);
            const tokenUserId = authorizedUser.user._id;
            const currentChat = req.body.chatid

            // console.log(`text is ${req.body.text}`);
            // console.log(`sender is ${tokenUserId}`);
            // console.log(`receiver is ${req.body.receiver}`);

            const newMessage = new Message({
                sender: tokenUserId,
                receiver: req.body.receiver,
                chat: currentChat,
                text: req.body.text,
                timestamp: Date.now()
            })

            console.log(newMessage);
            
            return res.json({
                msg: "Message sent",
                message: newMessage
            })

            // if (!errors.isEmpty()) {
            //     res.json({
            //         msg: "Something is wrong",
            //         newMessage: newMessage,
            //         errors: errors.array(),
            //     })
            //     return
            // } else {
            //     await newMessage.save();
            //     return res.json({
            //         msg: "Message sent",
            //         newMessage: newMessage
            //     })
            // }
        } catch (err) {
            console.log(err);
        }
    }
]