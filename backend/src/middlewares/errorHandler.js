// Simple error middleware returning a generic message to the client.
function errorHandler(err, req, res, _next) {
  console.error(err);
  res.status(500).json({ message: 'Une erreur est survenue' });
}

module.exports = errorHandler;
