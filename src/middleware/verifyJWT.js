const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    console.log("Geen token gevonden");
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT fout:', err);
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
