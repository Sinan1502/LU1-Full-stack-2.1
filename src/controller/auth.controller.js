const UsersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data; }
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Registreren
const handleRegister = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

  const duplicate = UsersDB.users.find(person => person.username === user);
  if (duplicate) return res.sendStatus(409);

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = { username: user, password: hashedPwd };
    UsersDB.setUsers([...UsersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(UsersDB.users)
    );

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Inloggen
const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

  const foundUser = UsersDB.users.find(person => person.username === user);
  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (!match) return res.sendStatus(401);

  // Genereer tokens
  const accessToken = jwt.sign(
    { username: foundUser.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  // Update refreshToken
  const otherUsers = UsersDB.users.filter(person => person.username !== foundUser.username);
  const currentUser = { ...foundUser, refreshToken };
  UsersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(UsersDB.users)
  );
  // Stuur cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false, 
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({ success: true });
};

// Refresh token
const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(401);

  const refreshToken = cookies.refreshToken;
  const foundUser = UsersDB.users.find(person => person.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
      maxAge: 15 * 60 * 1000
    });

    res.json({ success: true });
  });
};

// Uitloggen
const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204);

  const refreshToken = cookies.refreshToken;
  const foundUser = UsersDB.users.find(person => person.refreshToken === refreshToken);

  if (foundUser) {
    const otherUsers = UsersDB.users.filter(person => person.refreshToken !== refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' };
    UsersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(UsersDB.users)
    );
  }

  // Clear cookies
  res.clearCookie('accessToken', { httpOnly: true, sameSite: 'Lax', secure: false });
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Lax', secure: false });
  res.sendStatus(204);
};

module.exports = {
  handleRegister,
  handleLogin,
  handleRefreshToken,
  handleLogout
};
