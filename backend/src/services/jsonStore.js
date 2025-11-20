const fs = require('fs').promises;
const path = require('path');

// Lightweight JSON file store with in-memory cache + persistence.
class JsonStore {
  constructor(filename) {
    this.filePath = path.join(__dirname, '..', '..', 'data', filename);
    this.items = [];
  }

  async init() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.items = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.items = [];
        await this.persist();
        return;
      }
      console.error(`Failed to load ${this.filePath}:`, error);
      throw error;
    }
  }

  getAll() {
    return this.items;
  }

  findById(id) {
    return this.items.find((item) => item.id === id);
  }

  async add(item) {
    this.items.push(item);
    await this.persist();
    return item;
  }

  async update(id, payload) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }
    this.items[index] = { ...this.items[index], ...payload, id };
    await this.persist();
    return this.items[index];
  }

  async remove(id) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    this.items.splice(index, 1);
    await this.persist();
    return true;
  }

  async persist() {
    await fs.writeFile(this.filePath, JSON.stringify(this.items, null, 2));
  }
}

module.exports = JsonStore;
