const express = require('express');
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/createGroup', authMiddleware.authenticateUser, groupController.createGroup);
router.delete('/deleteGroup', authMiddleware.authenticateUser, groupController.deleteGroup);
router.get('/searchGroups/:name', authMiddleware.authenticateUser, groupController.searchGroups);
router.get('/groups', authMiddleware.authenticateUser, groupController.getAllGroups );
router.post('/addMembers', authMiddleware.authenticateUser, groupController.addMembersToGroup);

module.exports = router;