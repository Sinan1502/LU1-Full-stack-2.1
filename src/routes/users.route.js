var express = require('express');
var router = express.Router();

const verifyJWT = require('../middleware/verifyJWT');
const usersController=require('../controller/users.controller');

router.use(verifyJWT);

/* GET users listing. */
router.get('/', usersController.get);
router.get('/:userId/details', usersController.get);
//users update
router.get('/:userId/edit', usersController.update);
router.post('/:userId/edit', usersController.validate, usersController.update);

router.delete('/:userId', usersController.delete);

module.exports = router;
