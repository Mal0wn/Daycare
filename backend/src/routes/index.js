const express = require('express');
const { staffService, childrenService, activitiesService, inventoryService } = require('../services/storeRegistry');
const createController = require('../controllers/resourceControllerFactory');
const createResourceRouter = require('./resourceRouterFactory');
const {
  validateStaff,
  validateChild,
  validateActivity,
  validateInventory
} = require('../models/validators');

// Aggregates all resource routers under /api.
const router = express.Router();

router.use('/staff', createResourceRouter(createController(staffService, validateStaff)));
router.use('/children', createResourceRouter(createController(childrenService, validateChild)));
router.use('/activities', createResourceRouter(createController(activitiesService, validateActivity)));
router.use('/inventory', createResourceRouter(createController(inventoryService, validateInventory)));

module.exports = router;
