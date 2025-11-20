import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { StaffMember, StaffSchedule } from '../../types';
import { DAY_KEYS, dayLabels } from '../../utils/date';

const roleOptions = ['Educatrice', 'Assistant', 'Animateur', 'Psychomotricienne', 'Infirmière'];

// Form used for both creation and edition of staff members.
interface StaffFormProps {
  initialData?: StaffMember;
  onSubmit: (values: Omit<StaffMember, 'id'>) => Promise<void> | void;
  onCancel?: () => void;
}

// Prepares an empty week structure when nothing is set yet.
const createEmptySchedule = (): StaffSchedule =>
  DAY_KEYS.reduce((acc, day) => {
    acc[day] = { morning: false, afternoon: false };
    return acc;
  }, {} as StaffSchedule);

export const StaffForm = ({ initialData, onSubmit, onCancel }: StaffFormProps) => {
  const [values, setValues] = useState<Omit<StaffMember, 'id'>>({
    name: '',
    role: roleOptions[0],
    maxChildrenCapacity: 6,
    schedule: createEmptySchedule()
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Hydrate form fields when editing an existing member.
  useEffect(() => {
    if (initialData) {
      setValues({
        name: initialData.name,
        role: initialData.role,
        maxChildrenCapacity: initialData.maxChildrenCapacity,
        schedule: initialData.schedule || createEmptySchedule()
      });
    }
  }, [initialData]);

  const hasScheduleSelection = useMemo(
    () =>
      DAY_KEYS.some((day) => {
        const slot = values.schedule[day];
        return slot.morning || slot.afternoon;
      }),
    [values.schedule]
  );

  // Minimal validation ensures required data & at least one slot.
  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.name.trim()) nextErrors.name = 'Champ requis';
    if (!values.role.trim()) nextErrors.role = 'Champ requis';
    if (!values.maxChildrenCapacity) nextErrors.maxChildrenCapacity = 'Capacité obligatoire';
    if (!hasScheduleSelection) nextErrors.schedule = 'Sélectionner au moins un créneau';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Submit handler handles both create/update depending on editing state.
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      await onSubmit(values);
      if (!initialData) {
        setValues({
          name: '',
          role: roleOptions[0],
          maxChildrenCapacity: 6,
          schedule: createEmptySchedule()
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Toggle helper for double-checkbox grid.
  const toggleSlot = (day: keyof StaffSchedule, slot: 'morning' | 'afternoon') => {
    setValues((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: { ...prev.schedule[day], [slot]: !prev.schedule[day][slot] }
      }
    }));
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <div className={`form-field ${errors.name ? 'error' : ''}`}>
        <label>Nom</label>
        <input value={values.name} onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))} />
        {errors.name && <small>{errors.name}</small>}
      </div>
      <div className="form-inline">
        <div className={`form-field ${errors.role ? 'error' : ''}`}>
          <label>Rôle</label>
          <select value={values.role} onChange={(e) => setValues((prev) => ({ ...prev, role: e.target.value }))}>
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.role && <small>{errors.role}</small>}
        </div>
        <div className={`form-field ${errors.maxChildrenCapacity ? 'error' : ''}`}>
          <label>Capacité max</label>
          <input
            type="number"
            value={values.maxChildrenCapacity}
            min={1}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, maxChildrenCapacity: Number(e.target.value) || 0 }))
            }
          />
          {errors.maxChildrenCapacity && <small>{errors.maxChildrenCapacity}</small>}
        </div>
      </div>
      <div className={`form-field schedule-grid ${errors.schedule ? 'error' : ''}`}>
        <label>Créneaux</label>
        <div className="schedule-table">
          <div className="schedule-row header">
            <span></span>
            <span>Matin</span>
            <span>Après-midi</span>
          </div>
          {DAY_KEYS.map((day) => (
            <div key={day} className="schedule-row">
              <span>{dayLabels[day]}</span>
              <label>
                <input
                  type="checkbox"
                  checked={values.schedule[day].morning}
                  onChange={() => toggleSlot(day, 'morning')}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={values.schedule[day].afternoon}
                  onChange={() => toggleSlot(day, 'afternoon')}
                />
              </label>
            </div>
          ))}
        </div>
        {errors.schedule && <small>{errors.schedule}</small>}
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="ghost-btn" onClick={onCancel}>
            Annuler
          </button>
        )}
        <button type="submit" className="primary-btn" disabled={saving}>
          {saving ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Ajouter le membre'}
        </button>
      </div>
    </form>
  );
};
