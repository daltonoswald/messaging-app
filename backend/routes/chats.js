var express = require('express');
var router = express.Router();
const chat_controller = require('../controllers/chatController')
const multer = require('multer');
const upload = multer({ dest: './public/images'})

// router.get("/", (req, res) => {
//     res.json({ name: "frodo" });
// });

// router.post('/log-in', alreadyLoggedIn, user_controller.log_in);

router.post('/new-message', chat_controller.new_message)

router.post('/get-chats', chat_controller.get_chats);

router.post('/new-chat', chat_controller.new_chat);

// router.post('/new-chat-image', upload.single('message-image'), chat_controller.new_chat_image);

module.exports = router;