const { AUTH_USER, AUTH_PASSWORD, AUTH_TOKEN } = require('../config/auth');

// Basic credential check returning a static token (demo purposes only).
const login = (req, res) => {
  const { email, password } = req.body;
  if (email !== AUTH_USER.email || password !== AUTH_PASSWORD) {
    return res.status(401).json({ message: 'Identifiants invalides' });
  }
  return res.json({ token: AUTH_TOKEN, user: AUTH_USER });
};

// Auth middleware injects req.user, we simply echo it back.
const me = (req, res) => {
  return res.json({ user: req.user });
};

module.exports = { login, me };
