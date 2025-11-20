const { v4: uuid } = require('uuid');
const JsonStore = require('./jsonStore');

// Wraps JsonStore adding id generation + resource helpers.
class ResourceService {
  constructor(filename) {
    this.store = new JsonStore(filename);
  }

  async init() {
    await this.store.init();
  }

  getAll() {
    return this.store.getAll();
  }

  getById(id) {
    return this.store.findById(id);
  }

  async create(payload) {
    const item = { id: payload.id || uuid(), ...payload };
    return this.store.add(item);
  }

  async update(id, payload) {
    return this.store.update(id, payload);
  }

  async remove(id) {
    return this.store.remove(id);
  }
}

module.exports = ResourceService;
