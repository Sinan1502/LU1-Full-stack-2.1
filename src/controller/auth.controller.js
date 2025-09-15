const authService = require('../service/auth.service');

const handleRegister = async (req, res) => {
  try {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password required' });

    await authService.register(user, pwd);
    res.status(201).json({ success: `User ${user} created!` });
  } catch (err) {
    if (err.message.includes('exists')) return res.status(409).json({ message: err.message });
    console.error(err);
    res.sendStatus(500);
  }
};

const handleLogin = async (req, res) => {
  try {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password required' });

    const { accessToken, refreshToken } = await authService.login(user, pwd);

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'Lax', maxAge: 15*60*1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'Lax', maxAge: 24*60*60*1000 });

    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    const accessToken = await authService.refreshAccessToken(token);
    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'Lax', maxAge: 15*60*1000 });
    res.json({ success: true });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

const handleLogout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) await authService.logout(token);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  handleRefreshToken,
  handleLogout
};
