const createController = require('../resourceControllerFactory');

const createResponse = () => {
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };
  return res;
};

describe('resourceControllerFactory', () => {
  let service;
  let validator;
  let controller;

  beforeEach(() => {
    service = {
      getAll: jest.fn().mockReturnValue([{ id: '1' }]),
      getById: jest.fn().mockReturnValue({ id: '1', name: 'Item' }),
      create: jest.fn().mockResolvedValue({ id: '2' }),
      update: jest.fn().mockResolvedValue({ id: '1', name: 'Updated' }),
      remove: jest.fn().mockResolvedValue(true)
    };
    validator = jest.fn().mockReturnValue([]);
    controller = createController(service, validator);
  });

  test('list returns all items', () => {
    const res = createResponse();
    const next = jest.fn();

    controller.list({}, res, next);

    expect(service.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    expect(next).not.toHaveBeenCalled();
  });

  test('list forwards errors', () => {
    const error = new Error('boom');
    service.getAll.mockImplementation(() => {
      throw error;
    });
    const res = createResponse();
    const next = jest.fn();

    controller.list({}, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('get returns resource or 404', () => {
    const res = createResponse();
    const next = jest.fn();
    const req = { params: { id: '1' } };

    controller.get(req, res, next);
    expect(service.getById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'Item' });

    service.getById.mockReturnValue(null);
    controller.get({ params: { id: 'missing' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Ressource introuvable' });
  });

  test('create validates payload before persisting', async () => {
    const res = createResponse();
    const next = jest.fn();
    const req = { body: { name: 'Sam' } };

    await controller.create(req, res, next);

    expect(validator).toHaveBeenCalledWith({ name: 'Sam' });
    expect(service.create).toHaveBeenCalledWith({ name: 'Sam' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '2' });

    validator.mockReturnValue(['name']);
    service.create.mockClear();
    res.status.mockClear();
    res.json.mockClear();

    await controller.create(req, res, next);
    expect(service.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Données invalides', fields: ['name'] });
  });

  test('update merges existing data, validates and handles missing resources', async () => {
    const res = createResponse();
    const next = jest.fn();
    const req = { params: { id: '1' }, body: { name: 'Updated' } };

    await controller.update(req, res, next);
    expect(validator).toHaveBeenCalledWith({ id: '1', name: 'Updated' });
    expect(service.update).toHaveBeenCalledWith('1', { name: 'Updated' });
    expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'Updated' });

    validator.mockReturnValue(['name']);
    res.json.mockClear();
    res.status.mockClear();
    service.update.mockClear();

    await controller.update(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(service.update).not.toHaveBeenCalled();

    validator.mockReturnValue([]);
    service.update.mockResolvedValue(null);
    res.status.mockClear();

    await controller.update({ params: { id: 'missing' }, body: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Ressource introuvable' });
  });

  test('remove returns 204 or 404', async () => {
    const res = createResponse();
    const next = jest.fn();
    const req = { params: { id: '1' } };

    await controller.remove(req, res, next);
    expect(service.remove).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();

    service.remove.mockResolvedValue(false);
    res.status.mockClear();
    res.send.mockClear();

    await controller.remove(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Ressource introuvable' });
  });
});
