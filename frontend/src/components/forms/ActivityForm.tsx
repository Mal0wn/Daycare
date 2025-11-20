import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import type { Activity } from '../../types';

const weekdays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
const ageGroupOptions = ['Bébés', 'Petits', 'Moyens', 'Grands', 'Tous'];

// Activity form centralizes CRUD fields including souvenir photos.
interface ActivityFormProps {
  initialData?: Activity;
  onSubmit: (values: Omit<Activity, 'id'>) => Promise<void> | void;
  onCancel?: () => void;
}

export const ActivityForm = ({ initialData, onSubmit, onCancel }: ActivityFormProps) => {
  const [values, setValues] = useState<Omit<Activity, 'id'>>({
    name: '',
    description: '',
    weekday: weekdays[0],
    ageGroups: ['Bébés'],
    maxChildren: 10,
    pictures: []
  });
  const [photoInput, setPhotoInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Preload current activity whenever editing.
  useEffect(() => {
    if (initialData) {
      setValues({
        name: initialData.name,
        description: initialData.description,
        weekday: initialData.weekday,
        ageGroups: initialData.ageGroups,
        maxChildren: initialData.maxChildren,
        pictures: initialData.pictures || []
      });
    }
  }, [initialData]);

  // Allows selecting multiple age groups as chips.
  const toggleGroup = (group: string) => {
    setValues((prev) => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(group)
        ? prev.ageGroups.filter((item) => item !== group)
        : [...prev.ageGroups, group]
    }));
  };

  // Adds typed photo URL onto the picture list.
  const addPicture = () => {
    if (!photoInput.trim()) return;
    setValues((prev) => ({ ...prev, pictures: [...prev.pictures, photoInput.trim()] }));
    setPhotoInput('');
  };

  // Remove a souvenir photo by its URL.
  const removePicture = (url: string) => {
    setValues((prev) => ({ ...prev, pictures: prev.pictures.filter((item) => item !== url) }));
  };

  // Light validation for required text + capacity.
  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.name.trim()) nextErrors.name = 'Nom requis';
    if (!values.description.trim()) nextErrors.description = 'Description requise';
    if (!values.ageGroups.length) nextErrors.ageGroups = 'Sélectionner un groupe';
    if (!values.maxChildren) nextErrors.maxChildren = 'Capacité requise';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Create/update payload shares the same submit logic.
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      await onSubmit(values);
      if (!initialData) {
        setValues({ name: '', description: '', weekday: weekdays[0], ageGroups: ['Bébés'], maxChildren: 10, pictures: [] });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <div className={`form-field ${errors.name ? 'error' : ''}`}>
        <label>Nom de l'activité</label>
        <input value={values.name} onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))} />
        {errors.name && <small>{errors.name}</small>}
      </div>
      <div className={`form-field ${errors.description ? 'error' : ''}`}>
        <label>Description</label>
        <textarea value={values.description} onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))} />
        {errors.description && <small>{errors.description}</small>}
      </div>
      <div className="form-inline">
        <div className="form-field">
          <label>Jour</label>
          <select value={values.weekday} onChange={(e) => setValues((prev) => ({ ...prev, weekday: e.target.value }))}>
            {weekdays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div className={`form-field ${errors.maxChildren ? 'error' : ''}`}>
          <label>Places</label>
          <input
            type="number"
            min={1}
            value={values.maxChildren}
            onChange={(e) => setValues((prev) => ({ ...prev, maxChildren: Number(e.target.value) || 0 }))}
          />
          {errors.maxChildren && <small>{errors.maxChildren}</small>}
        </div>
      </div>
      <div className={`form-field ${errors.ageGroups ? 'error' : ''}`}>
        <label>Groupes concernés</label>
        <div className="chips">
          {ageGroupOptions.map((group) => {
            const isActive = values.ageGroups.includes(group);
            return (
              <button key={group} type="button" className={`chip ${isActive ? 'chip--active' : ''}`} onClick={() => toggleGroup(group)}>
                {group}
              </button>
            );
          })}
        </div>
        {errors.ageGroups && <small>{errors.ageGroups}</small>}
      </div>
      <div className="form-field">
        <label>Souvenirs photo</label>
        <div className="photo-grid">
          {values.pictures.map((pic) => (
            <div key={pic} className="photo-card">
              <img src={pic} alt="Souvenir" loading="lazy" />
              <button type="button" className="ghost-btn" onClick={() => removePicture(pic)}>
                Retirer
              </button>
            </div>
          ))}
        </div>
        <div className="photo-input">
          <input placeholder="URL de la photo" value={photoInput} onChange={(e) => setPhotoInput(e.target.value)} />
          <button type="button" className="ghost-btn" onClick={addPicture}>
            Ajouter la photo
          </button>
        </div>
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="ghost-btn" onClick={onCancel}>
            Annuler
          </button>
        )}
        <button className="primary-btn" type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : initialData ? 'Mettre à jour' : "Planifier l'activité"}
        </button>
      </div>
    </form>
  );
};
