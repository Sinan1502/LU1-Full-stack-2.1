const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authDao = require('../dao/auth.dao');
require('dotenv').config();

const authService = {
  register: (username, password, callback) => {
    authDao.get(username, (err, existing) => {
      if (err) return callback(err);
      if (existing) return callback(new Error('Username already exists'));

      bcrypt.hash(password, 10, (err, hashedPwd) => {
        if (err) return callback(err);
        const newUser = { username, password: hashedPwd };
        authDao.add(newUser, (err, result) => {
          if (err) return callback(err);
          callback(undefined, newUser);
        });
      });
    });
  },

  login: (username, password, callback) => {
    authDao.get(username, (err, user) => {
      if (err) return callback(err);
      if (!user) return callback(new Error('Invalid credentials'));

      bcrypt.compare(password, user.password, (err, match) => {
        if (err) return callback(err);
        if (!match) return callback(new Error('Invalid credentials'));

        const accessToken = jwt.sign(
          { username: user.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
          { username: user.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '1d' }
        );

        authDao.update(user.username, { refresh_token: refreshToken }, (err) => {
          if (err) return callback(err);
          callback(undefined, { accessToken, refreshToken });
        });
      });
    });
  },

  refreshAccessToken: (refreshToken, callback) => {
    authDao.getAll((err, users) => {
      if (err) return callback(err);
      const user = users.find(u => u.refresh_token === refreshToken);
      if (!user) return callback(new Error('Invalid refresh token'));

      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      } catch (err) {
        return callback(err);
      }
      if (decoded.username !== user.username) return callback(new Error('Token mismatch'));

      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      callback(undefined, accessToken);
    });
  },

  logout: (refreshToken, callback) => {
    authDao.getAll((err, users) => {
      if (err) return callback(err);
      const user = users.find(u => u.refresh_token === refreshToken);
      if (!user) return callback(); // nothing to do

      authDao.update(user.username, { refresh_token: null }, (err) => {
        if (err) return callback(err);
        callback();
      });
    });
  }
};

module.exports = authService;
