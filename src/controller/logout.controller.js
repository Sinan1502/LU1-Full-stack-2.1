const UsersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = (req, res) => {
  //On client, also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204)
 
  const refreshToken = cookies.jwt;
  //is refresh token in db??
  const foundUser = UsersDB.users.find(person => person.refreshToken === refreshToken);
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true });
    return res.sendStatus(204); 

  }

    
}

module.exports = { handleLogout };