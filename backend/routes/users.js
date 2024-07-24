var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController');
const alreadyLoggedIn = require('../middleware/middleware').alreadyLoggedIn;

router.get("/", (req, res) => {
    res.json({ name: "frodo" });
});

// router.post('/log-in', alreadyLoggedIn, user_controller.log_in);
router.post('/log-in', user_controller.log_in);

router.post('/sign-up', alreadyLoggedIn, user_controller.sign_up)

router.get('/user-list', user_controller.user_list);

router.get('/my-profile', user_controller.my_profile);

router.get('/profile/:userid', user_controller.profile);

router.put('/add-friend/:userid', user_controller.add_friend);

router.put('/remove-friend/:userid', user_controller.remove_friend);

module.exports = router;
