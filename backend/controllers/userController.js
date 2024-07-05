const User = require('../models/user');
const express = require('express');
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;

exports.log_in = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
        res.status(401).json({ message: "Username not found." });
    }
    try {
        bcryptjs.compare(req.body.password), user.password, (err, isMatch) => {
            if (err) return next(err);

            const options = {};
            options.expiresIn = 1 * 24 * 60 * 60;
            const token = jwt.json({ user }, process.env.TOKEN_KEY || TOKEN_KEY, options);

            if (!isMatch) {
                res.status(401).json({ message: "Incorrect password." });
            } else {
                console.log(user.username);
                res.json({ message: 'user logged in successfully', token, user });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})