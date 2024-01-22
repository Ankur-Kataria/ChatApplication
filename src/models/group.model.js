const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  });

  const Group = mongoose.model('Group', groupSchema);

  module.exports = Group;