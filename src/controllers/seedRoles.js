const mongoose = require('mongoose');
const Role = require('../models/role.model');
const User = require('../models/user.model');
const ENV = require("../config/DBConfig");

const seedRoles = async () => {
  try {
    const rolesToInsert = [
        { name: 'admin' },
        { name: 'user' },
      ];
  
      await Role.insertMany(rolesToInsert);
  
      console.log('Roles seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

module.exports = seedRoles;
