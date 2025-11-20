// Date helpers centralize business rules around schedule calculations.
import { differenceInYears, parseISO } from 'date-fns';
import type { Child, DayKey, StaffMember } from '../types';

export const DAY_KEYS: DayKey[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];

export const dayLabels: Record<DayKey, string> = {
  lundi: 'Lun',
  mardi: 'Mar',
  mercredi: 'Mer',
  jeudi: 'Jeu',
  vendredi: 'Ven'
};

// Determine which weekday (French) should be considered "today".
export function getTodayKey(): DayKey {
  const today = new Date();
  const mapping: DayKey[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
  const weekday = today.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
  const normalized = weekday.normalize('NFD').replace(/[^a-z]/g, '');
  const found = mapping.find((key) => normalized.includes(key.substring(0, 4)));
  return found || 'lundi';
}

// Returns age in years, safeguards invalid dates.
export function computeAge(birthDate: string): number {
  try {
    return differenceInYears(new Date(), parseISO(birthDate));
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export function isChildPresentToday(child: Child): boolean {
  const today = getTodayKey();
  const abbreviations: Record<DayKey, string> = {
    lundi: 'Lun',
    mardi: 'Mar',
    mercredi: 'Mer',
    jeudi: 'Jeu',
    vendredi: 'Ven'
  };
  const pattern = child.attendancePattern?.toLowerCase() || '';
  return pattern.includes(abbreviations[today].toLowerCase());
}

export function getDailyCapacity(staff: StaffMember[]): Record<DayKey, number> {
  return DAY_KEYS.reduce((acc, day) => {
    const total = staff.reduce((sum, member) => {
      const slot = member.schedule?.[day];
      return slot && (slot.morning || slot.afternoon) ? sum + member.maxChildrenCapacity : sum;
    }, 0);
    acc[day] = total;
    return acc;
  }, {} as Record<DayKey, number>);
}

export function formatFrenchDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(date));
}

export function describeRelativeDate(date: string): string {
  const formatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return formatter.format(new Date(date));
}
