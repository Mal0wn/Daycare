// Generic controller builder used by every resource.
function createController(service, validator) {
  return {
    list: (req, res, next) => {
      try {
        res.json(service.getAll());
      } catch (error) {
        next(error);
      }
    },
    get: (req, res, next) => {
      try {
        const item = service.getById(req.params.id);
        if (!item) {
          return res.status(404).json({ message: 'Ressource introuvable' });
        }
        res.json(item);
      } catch (error) {
        next(error);
      }
    },
    create: async (req, res, next) => {
      try {
        const errors = validator(req.body);
        if (errors.length) {
          return res.status(400).json({ message: 'Données invalides', fields: errors });
        }
        const item = await service.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        next(error);
      }
    },
    update: async (req, res, next) => {
      try {
        const errors = validator({ ...service.getById(req.params.id), ...req.body });
        if (errors.length) {
          return res.status(400).json({ message: 'Données invalides', fields: errors });
        }
        const updated = await service.update(req.params.id, req.body);
        if (!updated) {
          return res.status(404).json({ message: 'Ressource introuvable' });
        }
        res.json(updated);
      } catch (error) {
        next(error);
      }
    },
    remove: async (req, res, next) => {
      try {
        const deleted = await service.remove(req.params.id);
        if (!deleted) {
          return res.status(404).json({ message: 'Ressource introuvable' });
        }
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = createController;
