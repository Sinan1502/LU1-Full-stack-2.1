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
  delete: () => {},
};

module.exports = usersDao;