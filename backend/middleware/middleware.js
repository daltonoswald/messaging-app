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

module.exports = { alreadyLoggedIn }