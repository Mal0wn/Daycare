// Simple auth configuration for demo purposes.
const AUTH_USER = {
  email: process.env.ADMIN_EMAIL || 'direction@creche.fr',
  name: process.env.ADMIN_NAME || 'Directrice'
};

const AUTH_PASSWORD = process.env.ADMIN_PASSWORD || 'arcenciel';
const AUTH_TOKEN = process.env.API_TOKEN || 'daycare-demo-token';

module.exports = { AUTH_USER, AUTH_PASSWORD, AUTH_TOKEN };
