const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware  = require("../middleware/authMiddleware");

const router = express.Router();

// User registration
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// User logout
router.post('/logout', authMiddleware.authenticateUser, userController.logoutUser);

// createUser
router.post('/createUser', authMiddleware.authenticateAdmin, userController.createUser);

// editUser User
router.put('/editUser', authMiddleware.authenticateAdmin, userController.editUser);

module.exports = router;
