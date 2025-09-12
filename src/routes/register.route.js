const express = require('express');
const router = express.Router();
const registerController = require('../controller/register.controller');

router.get('/', (req, res) => {
  res.render('register', { title: 'Registreren' });
});

router.post('/', registerController.handleNewUser);

module.exports = router;
