const UsersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
  //On client, also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204)

  const refreshToken = cookies.jwt;
  //is refresh token in db??
  const foundUser = UsersDB.users.find(person => person.refreshToken === refreshToken);
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: false }); //secure: true - only serves on https
    return res.sendStatus(204);

  }
  //Delete refresh token in db
  const otherUsers = UsersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
  const currentUser = { ...foundUser, refreshToken: '' };
  UsersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(UsersDB.users)
  )
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'Lax',  // of 'None' als je dat bij login ook gebruikt
    secure: false     // of true in productie met HTTPS
  });

  res.sendStatus(204);
}

module.exports = { handleLogout };