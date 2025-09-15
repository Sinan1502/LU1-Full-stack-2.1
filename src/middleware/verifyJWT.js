const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.redirect('/'); // niet ingelogd → login

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT fout:', err);
      return res.redirect('/');
    }
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
