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

  delete: (userId, callback) => {
    usersDao.get(userId, (error, result) => {
      let users = result.filter(users => user.id == userId)[0];
      return callback(undefined, users);
    });
  }
}

module.exports = usersService;