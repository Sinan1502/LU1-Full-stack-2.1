const usersDao = require('../dao/users.dao');
const logger = require('../util/logger');
const {expect} = require("chai");

const usersService = {
validate: (email, firstName, lastName, active, callback) => {

  try{
    expect(firstName).to.be.a('string', 'First name must be a string');
    expect(lastName).to.be.a('string', 'Last name must be a string');
    expect(email).to.be.a('string', 'email must be a string');
    expect(active).to.be.a('number', 'Active must be a number');
    
    callback(undefined);
  }
  catch(err){
    callback(err)
  }
},

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