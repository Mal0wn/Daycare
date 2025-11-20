jest.mock('../resourceService', () =>
  jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(undefined),
    getAll: jest.fn()
  }))
);

const ResourceService = require('../resourceService');
const { initStores, staffService, childrenService, activitiesService, inventoryService } = require('../storeRegistry');
const getCreatedServices = () => ResourceService.mock.results.map((result) => result.value);

describe('storeRegistry', () => {

  test('instantiates one service per resource file', () => {
    expect(ResourceService).toHaveBeenCalledTimes(4);
    expect(ResourceService).toHaveBeenNthCalledWith(1, 'staff.json');
    expect(ResourceService).toHaveBeenNthCalledWith(2, 'children.json');
    expect(ResourceService).toHaveBeenNthCalledWith(3, 'activities.json');
    expect(ResourceService).toHaveBeenNthCalledWith(4, 'inventory.json');
  });

  test('exposes the instantiated services', () => {
    const [staff, children, activities, inventory] = getCreatedServices();
    expect(staffService).toBe(staff);
    expect(childrenService).toBe(children);
    expect(activitiesService).toBe(activities);
    expect(inventoryService).toBe(inventory);
  });

  test('initStores initializes every store in parallel', async () => {
    const services = getCreatedServices();
    services.forEach((service) => service.init.mockClear());
    await initStores();
    services.forEach((service) => {
      expect(service.init).toHaveBeenCalled();
    });
  });
});
