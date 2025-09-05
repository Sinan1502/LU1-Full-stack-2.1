var express = require('express');
var router = express.Router();

const usersController=require('../controller/users.controller');

/* GET users listing. */
router.get('/', usersController.get);
router.get('/:userId', usersController.get);
router.delete('/:userId', usersController.delete);

module.exports = router;
