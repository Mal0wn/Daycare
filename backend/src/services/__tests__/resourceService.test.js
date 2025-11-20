jest.mock('../jsonStore');
jest.mock('uuid', () => ({ v4: jest.fn(() => 'generated-id') }));

const JsonStore = require('../jsonStore');
const ResourceService = require('../resourceService');

function createStore(overrides = {}) {
  const store = {
    init: jest.fn(),
    getAll: jest.fn().mockReturnValue([{ id: '1' }]),
    findById: jest.fn().mockReturnValue({ id: '1' }),
    add: jest.fn().mockImplementation(async (item) => item),
    update: jest.fn().mockResolvedValue({ id: '1', name: 'Updated' }),
    remove: jest.fn().mockResolvedValue(true),
    ...overrides
  };
  JsonStore.mockImplementation(() => store);
  return store;
}

describe('ResourceService', () => {
  beforeEach(() => {
    JsonStore.mockReset();
  });

  test('getAll and getById proxy to the JsonStore', () => {
    const store = createStore();
    const service = new ResourceService('children.json');
    expect(service.getAll()).toEqual([{ id: '1' }]);
    expect(store.getAll).toHaveBeenCalled();

    expect(service.getById('1')).toEqual({ id: '1' });
    expect(store.findById).toHaveBeenCalledWith('1');
  });

  test('create generates an id when missing', async () => {
    const store = createStore();
    const service = new ResourceService('children.json');
    const payload = { firstName: 'Sam' };
    const created = await service.create(payload);
    expect(store.add).toHaveBeenCalledWith({ id: 'generated-id', ...payload });
    expect(created).toEqual({ id: 'generated-id', ...payload });
  });

  test('create keeps provided id intact', async () => {
    const store = createStore();
    const service = new ResourceService('children.json');
    await service.create({ id: 'child-1', firstName: 'Sam' });
    expect(store.add).toHaveBeenCalledWith({ id: 'child-1', firstName: 'Sam' });
  });

  test('update and remove delegate to JsonStore', async () => {
    const store = createStore({
      update: jest.fn().mockResolvedValue({ id: '1', role: 'Updated' }),
      remove: jest.fn().mockResolvedValue(true)
    });
    const service = new ResourceService('staff.json');
    const updated = await service.update('1', { role: 'Updated' });
    expect(store.update).toHaveBeenCalledWith('1', { role: 'Updated' });
    expect(updated).toEqual({ id: '1', role: 'Updated' });

    const removed = await service.remove('1');
    expect(store.remove).toHaveBeenCalledWith('1');
    expect(removed).toBe(true);
  });
});
