const UsersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
  // check for duplicate usernames in the db
  const duplicate = UsersDB.users.find(person => person.username === user);
  if (duplicate) return res.sendStatus(409);
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // store the new user
    const newUser = { "username": user, "password": hashedPwd };
    UsersDB.setUsers([...UsersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(UsersDB.users)
    );
    console.log(UsersDB.users);
    res.status(201).json({ 'success': `New user ${user} created!` });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }

}

module.exports = { handleNewUser };