// Demo parent accounts mapped to their children's IDs (read-only portal).
const normalize = (email) => (email || '').toLowerCase().trim();
const normalizePassword = (pwd) => (pwd || '').trim();

const PARENT_ACCOUNTS = [
  {
    email: normalize(process.env.PARENT_ONE_EMAIL || 'parent.elise@demo.fr'),
    password: normalizePassword(process.env.PARENT_ONE_PASSWORD || 'parent123'),
    name: 'Parent Élise',
    childIds: ['ch-1'],
    token: process.env.PARENT_ONE_TOKEN || 'parent-token-elise'
  },
  {
    email: normalize(process.env.PARENT_TWO_EMAIL || 'parent.noah@demo.fr'),
    password: normalizePassword(process.env.PARENT_TWO_PASSWORD || 'parent123'),
    name: 'Parent Noah',
    childIds: ['ch-2'],
    token: process.env.PARENT_TWO_TOKEN || 'parent-token-noah'
  }
];

const findParentByCredentials = (email, password) =>
  PARENT_ACCOUNTS.find((p) => p.email === normalize(email) && p.password === normalizePassword(password));
const findParentByToken = (token) => PARENT_ACCOUNTS.find((p) => p.token === token);

module.exports = { PARENT_ACCOUNTS, findParentByCredentials, findParentByToken };
