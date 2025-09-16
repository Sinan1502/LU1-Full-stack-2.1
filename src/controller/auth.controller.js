const authService = require('../service/auth.service');

const handleRegister = (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password required' });

  authService.register(user, pwd, (err, newUser) => {
    if (err) {
      if (err.message.includes('exists')) return res.status(409).json({ message: err.message });
      console.error(err);
      return res.sendStatus(500);
    }
    res.status(201).json({ success: `User ${user} created!` });
  });
};

const handleLogin = (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password required' });

  authService.login(user, pwd, (err, tokens) => {
    if (err) return res.status(401).json({ message: err.message });

    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, sameSite: 'Lax', maxAge: 15*60*1000 });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'Lax', maxAge: 24*60*60*1000 });

    res.json({ success: true });
  });
};

const handleRefreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  authService.refreshAccessToken(token, (err, accessToken) => {
    if (err) return res.status(403).json({ message: err.message });

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'Lax', maxAge: 15*60*1000 });
    res.json({ success: true });
  });
};

const handleLogout = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.sendStatus(204);
  }

  authService.logout(token, (err) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    if (err) return res.sendStatus(500);
    res.sendStatus(204);
  });
};

module.exports = {
  handleRegister,
  handleLogin,
  handleRefreshToken,
  handleLogout
};
