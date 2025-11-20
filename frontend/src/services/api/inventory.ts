// Inventory endpoints for milk/water tracking.
import api from './client';
import type { BabyInventoryItem } from '../../types';

export const fetchInventory = async () => {
  const { data } = await api.get<BabyInventoryItem[]>('/inventory');
  return data;
};

export const createInventoryItem = async (payload: Omit<BabyInventoryItem, 'id'>) => {
  const { data } = await api.post<BabyInventoryItem>('/inventory', payload);
  return data;
};

export const updateInventoryItem = async (id: string, payload: Partial<BabyInventoryItem>) => {
  const { data } = await api.put<BabyInventoryItem>(`/inventory/${id}`, payload);
  return data;
};

export const deleteInventoryItem = async (id: string) => {
  await api.delete(`/inventory/${id}`);
};
