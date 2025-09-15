const database = require('../db/connection').promise;

const authDao = {
  findByUsername: async (username) => {
    const [rows] = await database.query(
      'SELECT id, username, password, refresh_token FROM users WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  },

  addUser: async (userObj) => {
    const { username, password } = userObj;
    await database.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
  },

  updateUser: async (username, updatedFields) => {
    const fields = [];
    const values = [];

    for (const key in updatedFields) {
      fields.push(`${key} = ?`);
      values.push(updatedFields[key]);
    }

    values.push(username); 

    const query = `UPDATE users SET ${fields.join(', ')} WHERE username = ?`;
    await database.query(query, values);
  },

  getAll: async () => {
    const [rows] = await database.query(
      'SELECT id, username, password, refresh_token FROM users'
    );
    return rows;
  }
};

module.exports = authDao;
