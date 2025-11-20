// Staff API helpers wrap Axios responses into typed promises.
import api from './client';
import type { StaffMember } from '../../types';

export const fetchStaff = async () => {
  const { data } = await api.get<StaffMember[]>('/staff');
  return data;
};

export const createStaff = async (payload: Omit<StaffMember, 'id'>) => {
  const { data } = await api.post<StaffMember>('/staff', payload);
  return data;
};

export const updateStaff = async (id: string, payload: Partial<StaffMember>) => {
  const { data } = await api.put<StaffMember>(`/staff/${id}`, payload);
  return data;
};

export const deleteStaff = async (id: string) => {
  await api.delete(`/staff/${id}`);
};
