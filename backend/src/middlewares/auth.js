const { AUTH_TOKEN, AUTH_USER } = require('../config/auth');

// Very small auth guard: expects a static Bearer token and injects user info.
module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  const token = header.replace('Bearer ', '').trim();
  if (token !== AUTH_TOKEN) {
    return res.status(401).json({ message: 'Jeton invalide' });
  }
  req.user = AUTH_USER;
  return next();
};
