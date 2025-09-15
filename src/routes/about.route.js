const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('over-ons', { 
    title: 'Over Ons' 
  });
});

module.exports = router;
