const readFileMock = jest.fn();
const writeFileMock = jest.fn().mockResolvedValue(undefined);

jest.mock('fs', () => ({
  promises: {
    readFile: readFileMock,
    writeFile: writeFileMock
  }
}));

const JsonStore = require('../jsonStore');

describe('JsonStore', () => {
  beforeEach(() => {
    readFileMock.mockReset();
    writeFileMock.mockReset();
  });

  test('init loads existing data', async () => {
    readFileMock.mockResolvedValueOnce(JSON.stringify([{ id: '1' }]));
    const store = new JsonStore('children.json');

    await store.init();

    expect(store.getAll()).toEqual([{ id: '1' }]);
    expect(readFileMock).toHaveBeenCalled();
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  test('init creates file when none exists', async () => {
    const error = Object.assign(new Error('missing'), { code: 'ENOENT' });
    readFileMock.mockRejectedValueOnce(error);
    const store = new JsonStore('staff.json');

    await store.init();

    expect(store.getAll()).toEqual([]);
    expect(writeFileMock).toHaveBeenCalledWith(expect.stringContaining('staff.json'), JSON.stringify([], null, 2));
  });

  test('add persists new item', async () => {
    const store = new JsonStore('activities.json');
    store.items = [];

    const result = await store.add({ id: '1', name: 'Yoga' });

    expect(result).toEqual({ id: '1', name: 'Yoga' });
    expect(writeFileMock).toHaveBeenCalledWith(expect.stringContaining('activities.json'), JSON.stringify([{ id: '1', name: 'Yoga' }], null, 2));
  });

  test('update replaces the matching item and persists', async () => {
    const store = new JsonStore('inventory.json');
    store.items = [{ id: '1', name: 'Couches', quantity: 3 }];

    const updated = await store.update('1', { quantity: 5 });
    expect(updated).toEqual({ id: '1', name: 'Couches', quantity: 5 });
    expect(writeFileMock).toHaveBeenCalledWith(
      expect.stringContaining('inventory.json'),
      JSON.stringify([{ id: '1', name: 'Couches', quantity: 5 }], null, 2)
    );

    const missing = await store.update('missing', { quantity: 1 });
    expect(missing).toBeNull();
  });

  test('remove deletes an entry and returns boolean', async () => {
    const store = new JsonStore('activities.json');
    store.items = [{ id: '1' }, { id: '2' }];

    const removed = await store.remove('1');
    expect(removed).toBe(true);
    expect(store.items).toEqual([{ id: '2' }]);
    expect(writeFileMock).toHaveBeenCalledTimes(1);

    const missing = await store.remove('3');
    expect(missing).toBe(false);
  });
});
