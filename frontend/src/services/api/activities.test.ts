import { describe, expect, it, vi } from 'vitest';
import type { Activity } from '../../types';
import { fetchActivities, createActivity, updateActivity, deleteActivity } from './activities';

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}));

vi.mock('./client', () => ({
  default: mockApi
}));

describe('activities API helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchActivities returns list', async () => {
    const activities: Activity[] = [
      {
        id: '1',
        name: 'Danse',
        description: 'Bouger',
        weekday: 'lundi',
        ageGroups: ['Bébés'],
        maxChildren: 10,
        pictures: []
      }
    ];
    mockApi.get.mockResolvedValue({ data: activities });

    const result = await fetchActivities();

    expect(mockApi.get).toHaveBeenCalledWith('/activities');
    expect(result).toEqual(activities);
  });

  it('createActivity posts payload', async () => {
    const payload = {
      name: 'Danse',
      description: 'Bouger',
      weekday: 'lundi',
      ageGroups: ['Bébés'],
      maxChildren: 10,
      pictures: []
    };
    const created = { ...payload, id: '1' };
    mockApi.post.mockResolvedValue({ data: created });

    const result = await createActivity(payload);

    expect(mockApi.post).toHaveBeenCalledWith('/activities', payload);
    expect(result).toEqual(created);
  });

  it('updateActivity sends data to API', async () => {
    const updated = { id: '1', name: 'Danse', description: 'Nouvelle', weekday: 'mardi', ageGroups: ['Petits'], maxChildren: 8, pictures: [] };
    mockApi.put.mockResolvedValue({ data: updated });

    const result = await updateActivity('1', { maxChildren: 8 });

    expect(mockApi.put).toHaveBeenCalledWith('/activities/1', { maxChildren: 8 });
    expect(result).toEqual(updated);
  });

  it('deleteActivity calls DELETE endpoint', async () => {
    mockApi.delete.mockResolvedValue(undefined);
    await deleteActivity('3');
    expect(mockApi.delete).toHaveBeenCalledWith('/activities/3');
  });
});
