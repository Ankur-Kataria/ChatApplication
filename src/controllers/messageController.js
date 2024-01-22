const Message = require("../models/message.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");

// Create a new message
const createMessage = async (req, res) => {
    try {
      const { content, senderId, groupId, receiverId } = req.body;
  
      // Check if the sender exists
      const sender = await User.findById(senderId);
      if (!sender) {
        return res.status(404).json({ message: 'Sender not found' });
      }
  
      // Check if it's a group message or one-to-one message
      if (groupId) {
        // Group message
        const group = await Group.findById(groupId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
  
        // Check if the sender is a member of the group
        if (!group.members.includes(sender._id)) {
          return res.status(403).json({ message: 'Sender is not a member of the group' });
        }
  
        const newMessage = new Message({
          content,
          sender: sender._id,
          group: group._id,
        });
  
        await newMessage.save();
  
        res.status(201).json({ message: 'Group message created successfully', result: newMessage });
      } else if (receiverId) {
        // One-to-one message
        const receiver = await User.findById(receiverId);
        if (!receiver) {
          return res.status(404).json({ message: 'Receiver not found' });
        }
  
        const newMessage = new Message({
          content,
          sender: sender._id,
          receiver: receiver._id,
        });
  
        await newMessage.save();
  
        res.status(201).json({ message: 'One-to-one message created successfully', result: newMessage });
      } else {
        return res.status(400).json({ message: 'Invalid request. Specify either groupId or receiverId' });
      }
    } catch (error) {
      console.error('Error creating message:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };

// Like a message
const likeMessage = async (req, res) => {
  try {
    const { messageId, userId } = req.body;

    // Check if the message and user exist
    const message = await Message.findById(messageId);
    const user = await User.findById(userId);

    if (!message || !user) {
      return res.status(404).json({ message: "Message or User not found" });
    }

    // Check if the user has already liked the message
    if (message.likes.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "User already liked this message" });
    }

    // Add user to the likes array
    message.likes.push(user._id);
    await message.save();

    res.status(200).json({ message: "Message liked successfully" });
  } catch (error) {
    console.error("Error liking message:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get messages for a specific group
const getMessagesByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Check if the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Get messages for the group, including sender information
    const messages = await Message.find({ group: group._id }).populate(
      "sender",
      "username"
    );
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages by group:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createMessage,
  likeMessage,
  getMessagesByGroup,
};
