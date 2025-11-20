import type { FormEvent } from 'react';
import { useEffect, useId, useState } from 'react';
import type { Child } from '../../types';
import { DAY_KEYS, dayLabels } from '../../utils/date';

const ageGroups = ['Bébés', 'Petits', 'Moyens', 'Grands'];

// Form shared between create/edit flows for children.
interface ChildFormProps {
  initialData?: Child;
  onSubmit: (values: Omit<Child, 'id'>) => Promise<void> | void;
  onCancel?: () => void;
}

export const ChildForm = ({ initialData, onSubmit, onCancel }: ChildFormProps) => {
  const formId = useId();
  const [values, setValues] = useState<Omit<Child, 'id'>>({
    firstName: '',
    lastName: '',
    birthDate: '',
    ageGroup: ageGroups[0],
    attendancePattern: ''
  });
  const [selection, setSelection] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const fieldIds = {
    firstName: `${formId}-firstName`,
    lastName: `${formId}-lastName`,
    birthDate: `${formId}-birthDate`,
    ageGroup: `${formId}-age-group`
  };

  // When editing we preload values + attendance chips.
  useEffect(() => {
    if (initialData) {
      const pattern = initialData.attendancePattern?.split('-') || [];
      setSelection(pattern);
      setValues({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        birthDate: initialData.birthDate,
        ageGroup: initialData.ageGroup,
        attendancePattern: initialData.attendancePattern
      });
    }
  }, [initialData]);

  // Chips act as toggles for each weekday selection.
  const toggleDay = (label: string) => {
    setSelection((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
  };

  // Ensure core identity fields plus at least one attendance day.
  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.firstName.trim()) nextErrors.firstName = 'Champ requis';
    if (!values.lastName.trim()) nextErrors.lastName = 'Champ requis';
    if (!values.birthDate) nextErrors.birthDate = 'Date obligatoire';
    if (!selection.length) nextErrors.attendancePattern = 'Choisir au moins un jour';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Submit dispatches create/update then clears form if needed.
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = { ...values, attendancePattern: selection.join('-') };
      await onSubmit(payload);
      if (!initialData) {
        setValues({ firstName: '', lastName: '', birthDate: '', ageGroup: ageGroups[0], attendancePattern: '' });
        setSelection([]);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <div className="form-inline">
        <div className={`form-field ${errors.firstName ? 'error' : ''}`}>
          <label htmlFor={fieldIds.firstName}>Prénom</label>
          <input
            id={fieldIds.firstName}
            value={values.firstName}
            onChange={(e) => setValues((prev) => ({ ...prev, firstName: e.target.value }))}
          />
          {errors.firstName && <small>{errors.firstName}</small>}
        </div>
        <div className={`form-field ${errors.lastName ? 'error' : ''}`}>
          <label htmlFor={fieldIds.lastName}>Nom</label>
          <input
            id={fieldIds.lastName}
            value={values.lastName}
            onChange={(e) => setValues((prev) => ({ ...prev, lastName: e.target.value }))}
          />
          {errors.lastName && <small>{errors.lastName}</small>}
        </div>
      </div>
      <div className="form-inline">
        <div className={`form-field ${errors.birthDate ? 'error' : ''}`}>
          <label htmlFor={fieldIds.birthDate}>Date de naissance</label>
          <input
            id={fieldIds.birthDate}
            type="date"
            value={values.birthDate}
            onChange={(e) => setValues((prev) => ({ ...prev, birthDate: e.target.value }))}
          />
          {errors.birthDate && <small>{errors.birthDate}</small>}
        </div>
        <div className="form-field">
          <label htmlFor={fieldIds.ageGroup}>Groupe d'âge</label>
          <select
            id={fieldIds.ageGroup}
            value={values.ageGroup}
            onChange={(e) => setValues((prev) => ({ ...prev, ageGroup: e.target.value }))}
          >
            {ageGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={`form-field ${errors.attendancePattern ? 'error' : ''}`}>
        <label>Présence hebdomadaire</label>
        <div className="chips">
          {DAY_KEYS.map((day) => {
            const label = dayLabels[day];
            const isActive = selection.includes(label);
            return (
              <button
                type="button"
                key={day}
                className={`chip ${isActive ? 'chip--active' : ''}`}
                onClick={() => toggleDay(label)}
              >
                {label}
              </button>
            );
          })}
        </div>
        {errors.attendancePattern && <small>{errors.attendancePattern}</small>}
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="ghost-btn" onClick={onCancel}>
            Annuler
          </button>
        )}
        <button className="primary-btn" type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Ajouter un enfant'}
        </button>
      </div>
    </form>
  );
};
