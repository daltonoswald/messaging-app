const User = require('../models/user');
const express = require('express');
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const { body, check, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const { generateToken, verifyToken } = require('../middleware/middleware');

exports.log_in = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
        res.status(401).json({ message: "Username not found." });
    }
    try {
        bcryptjs.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) return next(err);

            const options = {};
            options.expiresIn = 1 * 24 * 60 * 60;
            const token = jwt.sign({ user }, process.env.TOKEN_KEY || TOKEN_KEY, options);

            if (!isMatch) {
                res.status(401).json({ message: "Incorrect password." });
            } else {
                res.json({ message: 'user logged in successfully', token, user });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


exports.log_out = async(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        localStorage.removeItem('username')
        res.redirect('/');
        res.json({
            text: "Logged out",
        })
    })
}

exports.sign_up = [
    body('first_name', 'First Name must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('last_name', 'Last Name must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('username', 'Username must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('password', 'Password must not be empty.')
        .trim()
        .isLength({ min: 8 })
        .escape(),
    body('confirm_password', 'The passwords do not match.')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return false
            }
            return true
        }),
    body('profile_picture', 'Profile image is required')
        .trim()
        .escape(),
    body('bio')
        .trim()
        .escape(),

    async(req, res, next) => {
        try {
            const errors = validationResult(req);
            if (req.body.password !== req.body.confirm_password) {
                res.status(409).json({ message: "Passwords do not match." });
            }

            const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: await bcryptjs.hash(req.body.password, 10),
                bio: req.body.bio,
                date_joined: Date.now(),
                friends: [],
                chats: []
            });

            if (!errors.isEmpty()) {
                const errorsMessages = errors.array().map((error) => error.msg);
                res.json({ error: errorsMessages })
            } else {
                const usernameTaken = await User.findOne({
                    username: req.body.username,
                }).exec();
                if (usernameTaken) {
                    res.status(409).json({ message: "Username already in use." });
                } else {
                    await user.save();
                    res.json({ message: 'User successfully created' })
                    res.redirect('/');
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
]

exports.user_list = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const authorizedUser = verifyToken(token);

    // const allUsers = await User.find({}, "username, profile_picture").populate('username').exec();
    const allUsers = await User.find({ username: { $ne: authorizedUser.user.username } }).select( "-password -chats -friends").populate('username').exec();
    res.json(allUsers);
})

exports.my_profile = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const myProfile = await User.findOne({ username: authorizedUser.user.username }).populate('username friends').populate({ path: "chats", populate: { path: "users", select: 'username' }}).select('-password').exec();
    res.json(myProfile);
})

exports.profile = asyncHandler(async (req, res, next) => {
        const profile = await User.findById(req.params.userid).populate('username friends').select( "-password -chats" ).exec();

        if (profile === null) {
            const err = new Error("User not found");
            err.status = 400;
            return next(err)
        } else {
            res.json(profile);
        }
})

exports.add_friend = asyncHandler(async (req, res , next) => {
    const errors = validationResult(req);
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const tokenUserId = authorizedUser.user._id;
    const newFriend = await User.findById(req.params.userid);

    if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map((error) => error.msg);
        res.json({ error: errorsMessages})
    } else {
        const alreadyFriends = await User.findOne({
            _id: tokenUserId
        })
        if (alreadyFriends.friends.includes(newFriend._id)) {
            res.status(409).json({ message: "User is already your friend." });
        } else {
            let result = await User.findByIdAndUpdate(tokenUserId,
                { $push: {"friends": newFriend._id }}, 
                { upsert: true, new: true });
                res.json( {message: "Added friend"} )
        }
    }
})

exports.remove_friend = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const tokenUserId = authorizedUser.user._id;
    const removedFriend = await User.findById(req.params.userid);
    
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map((error) => error.msg);
        res.json({ error: errorsMessages })
    } else {
        const result = await User.findByIdAndUpdate(tokenUserId,
            { $pull: { "friends": removedFriend._id }},
            { upsert: true, new: true });
            res.json( {message: "Removed friend"} )
    }
})

exports.find_friends = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);

    const myFriends = await User.findOne({ username: authorizedUser.user.username }).select( 'friends' ).exec();
    res.json(myFriends);
})

exports.update_user = [
    body('first_name', 'First Name must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('last_name', 'Last Name must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('bio')
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        const tokenUserId = authorizedUser.user._id;

        // const user = await User.findById(tokenUserId).exec();

        const updatedUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            bio: req.body.bio,
        });

        if (!errors.isEmpty()) {
            res.json({ message: "Something is wrong",
            user: updatedUser,
            errors: errors.array(),
        })
        return;
        } else {
            await User.findByIdAndUpdate(tokenUserId, { first_name: req.body.first_name, last_name: req.body.last_name, bio: req.body.bio }, {});
            return res.json({ message: updatedUser });
        }
    })
]
