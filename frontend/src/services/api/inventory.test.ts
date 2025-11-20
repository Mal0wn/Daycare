import { describe, expect, it, vi } from 'vitest';
import type { BabyInventoryItem } from '../../types';
import { fetchInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from './inventory';

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}));

vi.mock('./client', () => ({
  default: mockApi
}));

describe('inventory API helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchInventory returns data', async () => {
    const items: BabyInventoryItem[] = [
      {
        id: '1',
        childId: 'child-1',
        type: 'Lait',
        brand: 'Douceur',
        quantity: 2,
        unit: 'boite',
        dateReceived: '2024-01-01',
        expirationDate: '2024-02-01',
        notes: ''
      }
    ];
    mockApi.get.mockResolvedValue({ data: items });

    const result = await fetchInventory();

    expect(mockApi.get).toHaveBeenCalledWith('/inventory');
    expect(result).toEqual(items);
  });

  it('createInventoryItem posts payload', async () => {
    const payload = {
      childId: 'child-1',
      type: 'Lait',
      brand: 'Douceur',
      quantity: 2,
      unit: 'boite',
      dateReceived: '2024-01-01',
      expirationDate: '2024-02-01',
      notes: ''
    };
    const created = { ...payload, id: '1' };
    mockApi.post.mockResolvedValue({ data: created });

    const result = await createInventoryItem(payload);

    expect(mockApi.post).toHaveBeenCalledWith('/inventory', payload);
    expect(result).toEqual(created);
  });

  it('updateInventoryItem sends payload', async () => {
    const updated = { id: '1', ...{
      childId: 'child-1',
      type: 'Lait',
      brand: 'Douceur',
      quantity: 3,
      unit: 'boite',
      dateReceived: '2024-01-01',
      expirationDate: '2024-02-01',
      notes: ''
    }};
    mockApi.put.mockResolvedValue({ data: updated });

    const result = await updateInventoryItem('1', { quantity: 3 });

    expect(mockApi.put).toHaveBeenCalledWith('/inventory/1', { quantity: 3 });
    expect(result).toEqual(updated);
  });

  it('deleteInventoryItem calls DELETE', async () => {
    mockApi.delete.mockResolvedValue(undefined);
    await deleteInventoryItem('4');
    expect(mockApi.delete).toHaveBeenCalledWith('/inventory/4');
  });
});
