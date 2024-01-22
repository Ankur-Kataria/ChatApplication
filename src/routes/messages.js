const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new message
router.post('/createMessage', authMiddleware.authenticateUser, messageController.createMessage);

// Like a message
router.post('/likeMessage', authMiddleware.authenticateUser, messageController.likeMessage);

// Get messages for a specific group
router.get('/getMessagesByGroup/:groupId', authMiddleware.authenticateUser, messageController.getMessagesByGroup);

module.exports = router;