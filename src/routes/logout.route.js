const express = require('express');
const router = express.Router();
const logoutController = require('../controller/logout.controller');

router.get('/', logoutController.handleLogout);

module.exports = router;
