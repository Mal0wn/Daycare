const ResourceService = require('./resourceService');

const staffService = new ResourceService('staff.json');
const childrenService = new ResourceService('children.json');
const activitiesService = new ResourceService('activities.json');
const inventoryService = new ResourceService('inventory.json');

// Initialize all stores on server startup before listening.
async function initStores() {
  await Promise.all([
    staffService.init(),
    childrenService.init(),
    activitiesService.init(),
    inventoryService.init()
  ]);
}

module.exports = {
  initStores,
  staffService,
  childrenService,
  activitiesService,
  inventoryService
};
