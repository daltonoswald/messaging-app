var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController');
const alreadyLoggedIn = require('../middleware/middleware').alreadyLoggedIn;

router.get("/", (req, res) => {
    res.json({ name: "frodo" });
});

router.post('/log-in', alreadyLoggedIn, user_controller.log_in);

router.post('/sign-up', alreadyLoggedIn, user_controller.sign_up)

module.exports = router;
