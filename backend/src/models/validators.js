// Basic synchronous validation routines for each resource.
function validateStaff(payload) {
  const errors = [];
  if (!payload.name || typeof payload.name !== 'string') {
    errors.push('name');
  }
  if (!payload.role || typeof payload.role !== 'string') {
    errors.push('role');
  }
  if (typeof payload.maxChildrenCapacity !== 'number' || payload.maxChildrenCapacity <= 0) {
    errors.push('maxChildrenCapacity');
  }
  if (!payload.schedule || typeof payload.schedule !== 'object') {
    errors.push('schedule');
  }
  return errors;
}

function validateChild(payload) {
  const errors = [];
  if (!payload.firstName) errors.push('firstName');
  if (!payload.lastName) errors.push('lastName');
  if (!payload.birthDate) errors.push('birthDate');
  if (!payload.ageGroup) errors.push('ageGroup');
  if (!payload.attendancePattern) errors.push('attendancePattern');
  return errors;
}

function validateActivity(payload) {
  const errors = [];
  if (!payload.name) errors.push('name');
  if (!payload.description) errors.push('description');
  if (!Array.isArray(payload.ageGroups) || !payload.ageGroups.length) errors.push('ageGroups');
  if (!payload.weekday) errors.push('weekday');
  if (typeof payload.maxChildren !== 'number' || payload.maxChildren <= 0) errors.push('maxChildren');
  return errors;
}

function validateInventory(payload) {
  const errors = [];
  if (!payload.childId) errors.push('childId');
  if (!payload.type) errors.push('type');
  if (!payload.brand) errors.push('brand');
  if (typeof payload.quantity !== 'number' || payload.quantity <= 0) errors.push('quantity');
  if (!payload.unit) errors.push('unit');
  if (!payload.dateReceived) errors.push('dateReceived');
  if (!payload.expirationDate) errors.push('expirationDate');
  return errors;
}

module.exports = {
  validateStaff,
  validateChild,
  validateActivity,
  validateInventory
};
