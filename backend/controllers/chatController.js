const User = require('../models/user');
const Chat = require('../models/chat');
const Message = require('../models/message');
const express = require('express');
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const { body, check, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const LocalStrategy = require('passport-local').Strategy;
const { generateToken, verifyToken } = require('../middleware/middleware');

exports.user_list = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const authorizedUser = verifyToken(token);
    const allUsers = await User.find({ username: { $ne: authorizedUser.user.username } }).select( "-password -chats -friends").populate('username').exec();
    res.json(allUsers);
})

exports.get_chats = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const receiver = req.body.receiver;
    const authorizedUser = verifyToken(token);
    const tokenUserId = authorizedUser.user._id;
    const allMessages = await Chat.findOne({ users: { $all: [tokenUserId, receiver]} }).populate({ path: "messages", populate: { path: "sender receiver", select: 'username' }}).exec();
    res.json(allMessages);
})

exports.new_chat = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const tokenUserId = authorizedUser.user._id;

    const currentChat = await Chat.findOne({ users: { $all: [tokenUserId, req.body.receiver]} }).exec();

    if (!currentChat) {
        const chat = new Chat({
            users: [tokenUserId, req.body.receiver],
            messages: [],
            created: Date.now(),
        })
        
        if (!errors.isEmpty()) {
            const errorsMessages = errors.array().map((error) => error.msg);
            res.json({ error: errorsMessages });
        } else {
            await chat.save();
            let update = await User.findByIdAndUpdate(tokenUserId,
                { $push: { "chats": chat._id }},
                { upsert: true, new: true });
            let updateOther = await User.findByIdAndUpdate(req.body.receiver,
                { $push: { "chats": chat._id }},
                { upsert: true, new: true });
            res.json({ message: "New chat created" });
        }
    }

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

            const currentChat = await Chat.findOne({ users: { $all: [tokenUserId, req.body.receiver]} }).exec();

            if (!currentChat) {
                const chat = new Chat({
                    users: [tokenUserId, req.body.receiver],
                    messages: [],
                    created: Date.now(),
                })
                
                if (!errors.isEmpty()) {
                    const errorsMessages = errors.array().map((error) => error.msg);
                    res.json({ error: errorsMessages });
                } else {
                    await chat.save();
                    let update = await User.findByIdAndUpdate(tokenUserId,
                        { $push: { "chats": chat._id }},
                        { upsert: true, new: true });
                    res.json({ message: "New chat created" });
                }
            }
            
            const newMessage = new Message({
                sender: tokenUserId,
                receiver: req.body.receiver,
                chat: currentChat._id,
                text: req.body.text,
                timestamp: Date.now()
            })

            if (!errors.isEmpty()) {
                res.json({
                    msg: "Something is wrong",
                    newMessage: newMessage,
                    errors: errors.array(),
                })
                return
            } else {
                await newMessage.save();
                let update = await Chat.findByIdAndUpdate(currentChat._id,
                    { $push: { "messages": newMessage._id }},
                    { upsert: true, new: true });
                return res.json({
                    msg: "Message sent",
                    newMessage: newMessage
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
]