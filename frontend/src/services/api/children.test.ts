import { describe, expect, it, vi } from 'vitest';
import type { Child } from '../../types';
import { fetchChildren, createChild, updateChild, deleteChild } from './children';

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}));

vi.mock('./client', () => ({
  default: mockApi
}));

describe('children API helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchChildren retrieves data', async () => {
    const payload: Child[] = [{ id: '1', firstName: 'Sam', lastName: 'Doe', birthDate: '2020-01-01', ageGroup: 'Bébés', attendancePattern: 'Lun' }];
    mockApi.get.mockResolvedValue({ data: payload });

    const result = await fetchChildren();

    expect(mockApi.get).toHaveBeenCalledWith('/children');
    expect(result).toEqual(payload);
  });

  it('createChild posts payload and returns created entity', async () => {
    const payload = { firstName: 'Sam', lastName: 'Doe', birthDate: '2020-01-01', ageGroup: 'Bébés', attendancePattern: 'Lun' };
    const created = { ...payload, id: '1' };
    mockApi.post.mockResolvedValue({ data: created });

    const result = await createChild(payload);

    expect(mockApi.post).toHaveBeenCalledWith('/children', payload);
    expect(result).toEqual(created);
  });

  it('updateChild sends PUT request and returns updated entity', async () => {
    const updated = { id: '1', firstName: 'Sam', lastName: 'Doe', birthDate: '2020-01-01', ageGroup: 'Petits', attendancePattern: 'Lun' };
    mockApi.put.mockResolvedValue({ data: updated });

    const result = await updateChild('1', { ageGroup: 'Petits' });

    expect(mockApi.put).toHaveBeenCalledWith('/children/1', { ageGroup: 'Petits' });
    expect(result).toEqual(updated);
  });

  it('deleteChild sends DELETE request', async () => {
    mockApi.delete.mockResolvedValue(undefined);

    await deleteChild('2');

    expect(mockApi.delete).toHaveBeenCalledWith('/children/2');
  });
});
