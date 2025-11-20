const {
  validateStaff,
  validateChild,
  validateActivity,
  validateInventory
} = require('../validators');

describe('validators', () => {
  test('validateStaff returns missing fields', () => {
    const result = validateStaff({
      name: 'Léa',
      role: 'Educator',
      maxChildrenCapacity: 5,
      schedule: { lundi: { morning: true, afternoon: false } }
    });
    expect(result).toEqual([]);

    const invalid = validateStaff({});
    expect(invalid).toContain('name');
    expect(invalid).toContain('role');
    expect(invalid).toContain('maxChildrenCapacity');
    expect(invalid).toContain('schedule');
  });

  test('validateChild enforces key fields', () => {
    const valid = validateChild({
      firstName: 'Sam',
      lastName: 'Doe',
      birthDate: '2020-01-01',
      ageGroup: 'B',
      attendancePattern: 'Lun, Mar'
    });
    expect(valid).toEqual([]);
    const invalid = validateChild({});
    expect(invalid).toEqual(['firstName', 'lastName', 'birthDate', 'ageGroup', 'attendancePattern']);
  });

  test('validateActivity checks constraints', () => {
    const valid = validateActivity({
      name: 'Danse',
      description: 'Mouvement libre',
      ageGroups: ['B'],
      weekday: 'lundi',
      maxChildren: 5
    });
    expect(valid).toEqual([]);

    const invalid = validateActivity({});
    expect(invalid).toEqual(['name', 'description', 'ageGroups', 'weekday', 'maxChildren']);
  });

  test('validateInventory ensures all fields exist', () => {
    const valid = validateInventory({
      childId: '1',
      type: 'Couches',
      brand: 'Bambou',
      quantity: 4,
      unit: 'paquets',
      dateReceived: '2024-01-01',
      expirationDate: '2024-02-01'
    });
    expect(valid).toEqual([]);

    const invalid = validateInventory({});
    expect(invalid).toEqual([
      'childId',
      'type',
      'brand',
      'quantity',
      'unit',
      'dateReceived',
      'expirationDate'
    ]);
  });
});
