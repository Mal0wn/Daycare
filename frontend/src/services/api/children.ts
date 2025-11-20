// Children API helpers keep requests consistent.
import api from './client';
import type { Child } from '../../types';

export const fetchChildren = async () => {
  const { data } = await api.get<Child[]>('/children');
  return data;
};

export const createChild = async (payload: Omit<Child, 'id'>) => {
  const { data } = await api.post<Child>('/children', payload);
  return data;
};

export const updateChild = async (id: string, payload: Partial<Child>) => {
  const { data } = await api.put<Child>(`/children/${id}`, payload);
  return data;
};

export const deleteChild = async (id: string) => {
  await api.delete(`/children/${id}`);
};
