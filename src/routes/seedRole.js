const express = require('express');
const seedRolesController = require('../controllers/seedRoles');
const router = express.Router();

// Seed roles
router.post('/seedrole', seedRolesController);

module.exports = router;
