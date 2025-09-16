const database = require('../db/connection').pool;

const authDao = {
  get: (username, callback) => {
    database.query(
      'SELECT id, username, password, refresh_token FROM users WHERE username = ?',
      [username],
      (error, results) => {
        if (error) return callback(error, undefined);
        if (results && results.length > 0) return callback(undefined, results[0]);
        return callback(undefined, null);
      }
    );
  },

  add: (userObj, callback) => {
    const { username, password } = userObj;
    database.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password],
      (error, results) => {
        if (error) return callback(error, undefined);
        return callback(undefined, results);
      }
    );
  },

  update: (username, updatedFields, callback) => {
    const fields = [];
    const values = [];

    for (const key in updatedFields) {
      fields.push(`${key} = ?`);
      values.push(updatedFields[key]);
    }
    values.push(username);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE username = ?`;
    database.query(query, values, (error, results) => {
      if (error) return callback(error, undefined);
      return callback(undefined, results);
    });
  },

  getAll: (callback) => {
    database.query(
      'SELECT id, username, password, refresh_token FROM users',
      (error, results) => {
        if (error) return callback(error, undefined);
        return callback(undefined, results);
      }
    );
  }
};

module.exports = authDao;
