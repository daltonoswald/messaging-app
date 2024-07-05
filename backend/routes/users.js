var express = require('express');
var router = express.Router();


router.post('/log-in', alreadyLoggedIn, user_controller.log_in);

module.exports = router;
