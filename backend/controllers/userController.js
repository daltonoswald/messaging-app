const User = require('../models/user');
const express = require('express');
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const { body, check, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;

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
                console.log(user.username);
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
                console.log("does not match")
                return false
            }
            console.log("matches")
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