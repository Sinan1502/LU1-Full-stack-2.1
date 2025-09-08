const usersService = require('../service/users.service');
const logger = require('../util/logger');

const usersController = {
  get: (req, res, next) => {
    let userId = req.params.userId;
    usersService.get(userId, (error, users) => {
      if (error) next(error);
      if (users) {
        userId == undefined
        ? res.render('users/table', { users: users })
        : res.render('users/details', { users: users[0] });
      }
    });
  },

  update: (req, res, next) => {
    let userId = req.params.userId;
    req.method == 'GET'
      ? usersService.get(userId, (error, users) => {
        if (error) next(error);
        if (users) {
          res.render('users/edit', { users: users[0] });
        }
      })
      //: usersService.update();
      : logger.debug(req.body);
  },
  delete: (req, res, next) => {
    let userId = req.params.userId;
    usersService.delete(userId, (error, result) => {
      if (error) next(error);
      if (users) {
        res.render('users/users', { users: users });
      }
    });
  },
};

module.exports = usersController;