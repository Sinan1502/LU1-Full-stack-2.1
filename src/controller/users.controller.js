const usersService = require('../service/users.service');
const logger = require('../util/logger');

const usersController = {

  validate (req, res, next) {
    let userId = req.params.userId;
    logger.debug(req.body);
    let { email, firstName, lastName, active } = req.body;
    active = parseInt(active);
    usersService.validate(email, firstName, lastName, active, (error) => {
      if (error) next (error);
      next()
    });
  },


  get: (req, res, next) => {
    let userId = req.params.userId;
    usersService.get(userId, (error, users) => {
      if (error) next(error);
      if (users) {
        userId == undefined
        ? res.render('users/table', { users: users })
        : res.render('users/details', { users: users[0]});
      }
    });
  },

  update: (req, res, next) => {
    let userId = req.params.userId;
    logger.debug(req.body);
    let { email, firstName, lastName, active } = req.body;
    req.method == 'GET'
      ? usersService.get(userId, (error, users) => {
        if (error) next(error);
        if (users) {
          res.render('users/edit', { users: users[0] });
        }
      })
      : usersService.update(email, userId, firstName, lastName, active, (error, result) => {

        if (error) next(error);
        if (result) res.redirect(301,`/users/${userId}/details`);
        
      });
  },
  delete: (req, res, next) => {
    let userId = req.params.userId;
    usersService.delete(userId, (error, users) => {
      if (error) next(error);
      if (users) res.json({
        status: 200,
        message: `User deleted`,
        data: [],
      })
    });
  },
};

module.exports = usersController;