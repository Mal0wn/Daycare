const errorHandler = require('../errorHandler');

describe('errorHandler middleware', () => {
  test('logs error and responds with generic message', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    errorHandler(new Error('boom'), {}, res, () => {});

    expect(consoleSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Une erreur est survenue' });
    consoleSpy.mockRestore();
  });
});
