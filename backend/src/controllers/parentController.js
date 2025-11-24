const { inventoryService, activitiesService } = require('../services/storeRegistry');
const { findParentByCredentials } = require('../config/parents');

const loginParent = (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = (req.body.password || '').trim();
  const parent = findParentByCredentials(email, password);
  if (!parent) {
    return res.status(401).json({ message: 'Identifiants invalides' });
  }
  return res.json({ token: parent.token, user: { email: parent.email, name: parent.name, childIds: parent.childIds } });
};

const listInventoryForParent = async (req, res) => {
  const parent = req.parent;
  const items = await inventoryService.getAll();
  const filtered = items.filter((item) => parent.childIds.includes(item.childId));
  res.json(filtered);
};

const listActivities = async (_req, res) => {
  const activities = await activitiesService.getAll();
  res.json(activities);
};

module.exports = { loginParent, listInventoryForParent, listActivities };
