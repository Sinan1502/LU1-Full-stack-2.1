const data = require('../db/example.data');
const database = require('../db/connection');

const usersDao = {
  get: (userId, callback) => {
    let query, params;

    if (userId == undefined) {
      query = 'SELECT * FROM ?? LIMIT 15';
      params = ['customer'];
    } else {
      query = 'SELECT * FROM ?? WHERE ??= ?';
      params = ['customer', 'customer_id', userId];
    }
    database.query(query, params, (error, results) => {
      if (error) return callback(error, undefined);
      if (results) return callback(undefined, results);
    });
  },

  update: (email, userId, firstName, lastName, active, callback) => {
    database.query(
      'UPDATE ?? SET ?? = ? WHERE ?? = ?',
      ['customer', 'email', email, 'first_name', firstName, 'last_name', lastName, 'active', active, 'customer_id', userId],
      (error, results) => {
        if (error) return callback(error, undefined);
        if (results) return callback(undefined, results);
      }
    )
  },

  delete: () => {},
};

module.exports = usersDao;