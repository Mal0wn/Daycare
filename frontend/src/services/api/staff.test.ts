import { describe, expect, it, vi } from 'vitest';
import type { StaffMember } from '../../types';
import { fetchStaff, createStaff, updateStaff, deleteStaff } from './staff';

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}));

vi.mock('./client', () => ({
  default: mockApi
}));

describe('staff API helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchStaff returns roster', async () => {
    const staff: StaffMember[] = [
      {
        id: '1',
        name: 'Emma',
        role: 'Educatrice',
        maxChildrenCapacity: 6,
        schedule: {
          lundi: { morning: true, afternoon: false },
          mardi: { morning: false, afternoon: false },
          mercredi: { morning: false, afternoon: false },
          jeudi: { morning: false, afternoon: false },
          vendredi: { morning: false, afternoon: false }
        }
      }
    ];
    mockApi.get.mockResolvedValue({ data: staff });

    const result = await fetchStaff();

    expect(mockApi.get).toHaveBeenCalledWith('/staff');
    expect(result).toEqual(staff);
  });

  it('createStaff posts payload', async () => {
    const payload = {
      name: 'Emma',
      role: 'Educatrice',
      maxChildrenCapacity: 6,
      schedule: {
        lundi: { morning: true, afternoon: false },
        mardi: { morning: false, afternoon: false },
        mercredi: { morning: false, afternoon: false },
        jeudi: { morning: false, afternoon: false },
        vendredi: { morning: false, afternoon: false }
      }
    };
    const created = { ...payload, id: '1' };
    mockApi.post.mockResolvedValue({ data: created });

    const result = await createStaff(payload);

    expect(mockApi.post).toHaveBeenCalledWith('/staff', payload);
    expect(result).toEqual(created);
  });

  it('updateStaff forwards partial payload', async () => {
    const updated = { id: '1', ...{ maxChildrenCapacity: 8 } };
    mockApi.put.mockResolvedValue({ data: updated });

    const result = await updateStaff('1', { maxChildrenCapacity: 8 });

    expect(mockApi.put).toHaveBeenCalledWith('/staff/1', { maxChildrenCapacity: 8 });
    expect(result).toEqual(updated);
  });

  it('deleteStaff sends delete', async () => {
    mockApi.delete.mockResolvedValue(undefined);
    await deleteStaff('5');
    expect(mockApi.delete).toHaveBeenCalledWith('/staff/5');
  });
});
