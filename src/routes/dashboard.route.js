const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

router.get('/', (req, res) => {
  res.render('dashboard', { title: 'Dashboard', user: req.user });
});

router.get('/over-ons', (req, res) => {
  res.render('over-ons', { title: 'Over Ons' });
});

module.exports = router;
