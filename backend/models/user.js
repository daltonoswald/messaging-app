const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 50 },
    last_name: { type: String, required: true, maxLength: 50 },
    username: { type: String, required: true, maxLength: 50 },
    password: { type: String, required: true, minLength: 8 },
    profile_picture: { type: String, required: false },
    bio: {type: String, required: true, maxLength: 100, required: false, default: "Hi, I just joined!" },
    date_joined: { type: Date, default: Date.now() },
    friends: [
        { type: Schema.Types.ObjectId, ref: "User", required: false }
    ],
    chats: [
        {type: Schema.Types.ObjectId, ref: "Chat", required: false }
    ]
})

module.exports = mongoose.model("User", UserSchema);