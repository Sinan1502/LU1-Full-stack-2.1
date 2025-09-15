const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

router.get('/', (req, res) => {
  res.render('dashboard', { title: 'Dashboard', user: req.user });
});

module.exports = router;
