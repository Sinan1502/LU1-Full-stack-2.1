const usersDao = require('../dao/users.dao');
const logger = require('../util/logger');

const usersService = {
  get: (userID, callback) => {
    usersDao.get(userID, (error, users) => {
      if (error) return callback(error, undefined);
      if (users)
        return callback(undefined, users);
      logger.debug(users);

    });
  },

  update: (email, userId, firstName, lastName, active, callback) => {
    usersDao.update(email, userId, firstName, lastName, active, (error, result) => {
      if (error) return callback(error, undefined);
      if (result) return callback(undefined, result);
    });
  },

  delete: (userId, callback) => {
    usersDao.get(userId, (error, result) => {
      let users = result.filter(users => user.id == userId)[0];
      return callback(undefined, users);
    });
  }
}

module.exports = usersService;