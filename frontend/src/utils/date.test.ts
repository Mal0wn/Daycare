import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Child, StaffMember } from '../types';
import { computeAge, getDailyCapacity, isChildPresentToday, getTodayKey, formatFrenchDate, describeRelativeDate } from './date';

describe('date helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('computeAge returns difference in years and falls back to 0 on invalid input', () => {
    vi.setSystemTime(new Date('2024-01-10T00:00:00Z'));
    expect(computeAge('2020-01-09')).toBe(4);
    expect(computeAge('invalid-date')).toBe(0);
  });

  it('isChildPresentToday checks the attendance pattern against today', () => {
    const child: Child = {
      id: '1',
      firstName: 'Sam',
      lastName: 'Doe',
      birthDate: '2020-05-01',
      ageGroup: 'B',
      attendancePattern: 'Lun, Mer, Ven'
    };

    vi.setSystemTime(new Date('2024-01-03T12:00:00Z'));
    expect(isChildPresentToday(child)).toBe(true);
    vi.setSystemTime(new Date('2024-01-04T12:00:00Z'));
    expect(isChildPresentToday(child)).toBe(false);
  });

  it('getDailyCapacity sums staff capacity for slots covering each day', () => {
    const staff: StaffMember[] = [
      {
        id: '1',
        name: 'Léa',
        role: 'Nurse',
        maxChildrenCapacity: 5,
        schedule: {
          lundi: { morning: true, afternoon: false },
          mardi: { morning: true, afternoon: true },
          mercredi: { morning: false, afternoon: false },
          jeudi: { morning: true, afternoon: false },
          vendredi: { morning: true, afternoon: false }
        }
      },
      {
        id: '2',
        name: 'Eli',
        role: 'Helper',
        maxChildrenCapacity: 3,
        schedule: {
          lundi: { morning: false, afternoon: false },
          mardi: { morning: true, afternoon: false },
          mercredi: { morning: true, afternoon: true },
          jeudi: { morning: false, afternoon: false },
          vendredi: { morning: false, afternoon: false }
        }
      }
    ];

    const result = getDailyCapacity(staff);
    expect(result.lundi).toBe(5);
    expect(result.mardi).toBe(8);
    expect(result.mercredi).toBe(3);
    expect(result.jeudi).toBe(5);
    expect(result.vendredi).toBe(5);
  });

  it('getTodayKey detects weekdays and falls back to lundi', () => {
    vi.setSystemTime(new Date('2024-05-27T12:00:00Z'));
    expect(getTodayKey()).toBe('lundi');
    const spy = vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('Dimanche');
    expect(getTodayKey()).toBe('lundi');
    spy.mockRestore();
  });

  it('formats French readable dates', () => {
    const formatted = formatFrenchDate('2024-01-15T00:00:00Z');
    expect(formatted).toBe(new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date('2024-01-15T00:00:00Z')));

    const relative = describeRelativeDate('2024-01-15T00:00:00Z');
    expect(relative).toBe(new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date('2024-01-15T00:00:00Z')));
  });
});
