const { findParentByToken } = require('../config/parents');

// Lightweight guard for parent portal routes.
module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  const token = header.replace('Bearer ', '').trim();
  const parent = findParentByToken(token);
  if (!parent) {
    return res.status(401).json({ message: 'Jeton invalide' });
  }
  req.parent = parent;
  return next();
};
