const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

router.get('/', verifyJWT, (req, res) => {
  res.render('dashboard', { title: 'Dashboard', user: req.user.username });
});

module.exports = router;
