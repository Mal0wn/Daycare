// Activities endpoints cover CRUD with souvenir photo updates.
import api from './client';
import type { Activity } from '../../types';

export const fetchActivities = async () => {
  const { data } = await api.get<Activity[]>('/activities');
  return data;
};

export const createActivity = async (payload: Omit<Activity, 'id'>) => {
  const { data } = await api.post<Activity>('/activities', payload);
  return data;
};

export const updateActivity = async (id: string, payload: Partial<Activity>) => {
  const { data } = await api.put<Activity>(`/activities/${id}`, payload);
  return data;
};

export const deleteActivity = async (id: string) => {
  await api.delete(`/activities/${id}`);
};
