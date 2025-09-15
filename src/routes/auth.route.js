const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');

// Registreren
router.get('/register', (req, res) => res.render('register', { title: 'Register' }));
router.post('/register', authController.handleRegister);

// Inloggen
router.post('/login', authController.handleLogin);

// Refresh token
router.get('/refresh', authController.handleRefreshToken);

// Uitloggen
router.get('/logout', authController.handleLogout);

module.exports = router;
