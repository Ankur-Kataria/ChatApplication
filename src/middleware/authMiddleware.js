const jwt = require('jsonwebtoken');
const config = require('../config/DBConfig');
const User = require('../models/user.model');
const Role = require("../models/role.model");

exports.authenticateAdmin = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: 'Authentication failed. User not authorized.' });
    }
    const findAdimRole = await Role.find({ _id: { $in: user.roles } });

    if(findAdimRole && findAdimRole.length > 0){
        let isAdmin = findAdimRole.some((item) => item.name == "admin");
        if (!isAdmin) {
            return res.status(403).json({ message: 'Authentication failed. User does not have admin role.' });
          }
    }

    req.user = user; // Attach user object to the request
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};

exports.authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: 'Authentication failed. User not authorized.' });
    }

    req.user = user; // Attach user object to the request
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};