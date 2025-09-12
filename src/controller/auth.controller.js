const UsersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data }
}
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
  const foundUser = UsersDB.users.find(person => person.username === user);
  if (!foundUser) return res.sendStatus(401); //UNauthorized

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //create JWT token
    const accessToken = jwt.sign(
      { "username": foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    const otherUsers = UsersDB.users.filter(person => person.username !== foundUser.username);
    const currentUser = { ...foundUser, refreshToken };
    UsersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(UsersDB.users)
    );
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ accesstoken });

  }
  else {
    res.sendStatus(401);
  }
}

module.exports = { handleLogin };