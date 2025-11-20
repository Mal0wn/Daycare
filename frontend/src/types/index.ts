// Shared TypeScript models mapping to backend resources.
export type DayKey = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi';

export interface ScheduleSlot {
  morning: boolean;
  afternoon: boolean;
}

export type StaffSchedule = Record<DayKey, ScheduleSlot>;

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  maxChildrenCapacity: number;
  schedule: StaffSchedule;
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  ageGroup: string;
  attendancePattern: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  ageGroups: string[];
  weekday: string;
  maxChildren: number;
  pictures: string[];
}

export interface BabyInventoryItem {
  id: string;
  childId: string;
  type: string;
  brand: string;
  quantity: number;
  unit: string;
  dateReceived: string;
  expirationDate: string;
  notes: string;
}

export interface ApiError {
  message: string;
  fields?: string[];
}
