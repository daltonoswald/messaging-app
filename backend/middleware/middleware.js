const jwt = require('jsonwebtoken');

const opts = { expiresIn: '1d' };
const secret = process.env.TOKEN_KEY;
const generateToken = (user) => jwt.sign({ id: user._id, username: user.username }, secret, opts);

const verifyToken = (token) => jwt.verify(token, secret);

const alreadyLoggedIn = (req, res, next) => {
    const alreadyLoggedIn = req.get('authenticationToken');
    console.log(`already logged in = ` + alreadyLoggedIn);
    
    if (alreadyLoggedIn) {
        res.sendStatus(400);
        res.redirect('/');
        next();
    } else {
        next();
    }
}

module.exports = { generateToken, verifyToken, alreadyLoggedIn }