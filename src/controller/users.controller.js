const usersService = require('../service/users.service');

const usersController = {
  get: (req, res, next) => {
    let userId = req.params.userId;
    usersService.get(userId, (error, users) => {
      if (error) next(error);
      if (users) {
        res.render('users', { users: users });
      }
    })

  },
  delete: (req, res, next) => {
    let userId = req.params.userId;
    usersService.delete(userId, (error, result) => {
      if (error) next(error);
      if (users) {
        res.render('users', { users: users });
      }
    })
  }
};

module.exports = usersController;