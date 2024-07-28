const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    text: { type: String, minLength: 1, maxLength: 1000, required: true},
    timestamp: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Message", MessageSchema);