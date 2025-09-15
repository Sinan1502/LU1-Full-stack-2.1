const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authDao = require('../dao/auth.dao');
require('dotenv').config();

const authService = {
  register: async (username, password) => {
    const existing = await authDao.findByUsername(username);
    if (existing) throw new Error('Username already exists');

    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPwd };
    await authDao.addUser(newUser);
    return newUser;
  },

  login: async (username, password) => {
    const user = await authDao.findByUsername(username);
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

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

    await authDao.updateUser(user.username, { refresh_token: refreshToken });

    return { accessToken, refreshToken };
  },

  refreshAccessToken: async (refreshToken) => {
    const users = await authDao.getAll();
    const user = users.find(u => u.refresh_token === refreshToken);
    if (!user) throw new Error('Invalid refresh token');

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (decoded.username !== user.username) throw new Error('Token mismatch');

    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    return accessToken;
  },

  logout: async (refreshToken) => {
    const users = await authDao.getAll();
    const user = users.find(u => u.refresh_token === refreshToken);
    if (!user) return;

    await authDao.updateUser(user.username, { refresh_token: null });
  }
};

module.exports = authService;
