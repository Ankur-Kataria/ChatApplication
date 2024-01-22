// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;