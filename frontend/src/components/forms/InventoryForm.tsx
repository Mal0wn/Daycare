import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import type { BabyInventoryItem, Child } from '../../types';

// Inventory form tracks per-child consumables and expiration info.
interface InventoryFormProps {
  childrenOptions: Child[];
  initialData?: BabyInventoryItem;
  onSubmit: (values: Omit<BabyInventoryItem, 'id'>) => Promise<void> | void;
  onCancel?: () => void;
}

const typeOptions = ['Lait infantile', 'Lait maternel', 'Eau'];
const unitOptions = ['Boite', 'pochette', 'ml'];

export const InventoryForm = ({ childrenOptions, initialData, onSubmit, onCancel }: InventoryFormProps) => {
  const [values, setValues] = useState<Omit<BabyInventoryItem, 'id'>>({
    childId: '',
    type: typeOptions[0],
    brand: '',
    quantity: 1,
    unit: unitOptions[0],
    dateReceived: '',
    expirationDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Populate default values on edit.
  useEffect(() => {
    if (initialData) {
      setValues({
        childId: initialData.childId,
        type: initialData.type,
        brand: initialData.brand,
        quantity: initialData.quantity,
        unit: initialData.unit,
        dateReceived: initialData.dateReceived,
        expirationDate: initialData.expirationDate,
        notes: initialData.notes
      });
    }
  }, [initialData]);

  // Ensures key relational fields + dates exist.
  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.childId) nextErrors.childId = 'Choisir un enfant';
    if (!values.brand.trim()) nextErrors.brand = 'Marque obligatoire';
    if (!values.dateReceived) nextErrors.dateReceived = 'Date requise';
    if (!values.expirationDate) nextErrors.expirationDate = 'Date requise';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Submit merges both create/update codepaths.
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      await onSubmit(values);
      if (!initialData) {
        setValues({ childId: '', type: typeOptions[0], brand: '', quantity: 1, unit: unitOptions[0], dateReceived: '', expirationDate: '', notes: '' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <div className={`form-field ${errors.childId ? 'error' : ''}`}>
        <label>Enfant</label>
        <select value={values.childId} onChange={(e) => setValues((prev) => ({ ...prev, childId: e.target.value }))}>
          <option value="">Sélectionner</option>
          {childrenOptions.map((child) => (
            <option key={child.id} value={child.id}>
              {child.firstName} {child.lastName}
            </option>
          ))}
        </select>
        {errors.childId && <small>{errors.childId}</small>}
      </div>
      <div className="form-inline">
        <div className="form-field">
          <label>Type</label>
          <select value={values.type} onChange={(e) => setValues((prev) => ({ ...prev, type: e.target.value }))}>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Unité</label>
          <select value={values.unit} onChange={(e) => setValues((prev) => ({ ...prev, unit: e.target.value }))}>
            {unitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-inline">
        <div className={`form-field ${errors.brand ? 'error' : ''}`}>
          <label>Marque / description</label>
          <input value={values.brand} onChange={(e) => setValues((prev) => ({ ...prev, brand: e.target.value }))} />
          {errors.brand && <small>{errors.brand}</small>}
        </div>
        <div className="form-field">
          <label>Quantité</label>
          <input
            type="number"
            min={1}
            value={values.quantity}
            onChange={(e) => setValues((prev) => ({ ...prev, quantity: Number(e.target.value) || 0 }))}
          />
        </div>
      </div>
      <div className="form-inline">
        <div className={`form-field ${errors.dateReceived ? 'error' : ''}`}>
          <label>Date d'entrée</label>
          <input type="date" value={values.dateReceived} onChange={(e) => setValues((prev) => ({ ...prev, dateReceived: e.target.value }))} />
          {errors.dateReceived && <small>{errors.dateReceived}</small>}
        </div>
        <div className={`form-field ${errors.expirationDate ? 'error' : ''}`}>
          <label>Date d'expiration</label>
          <input
            type="date"
            value={values.expirationDate}
            onChange={(e) => setValues((prev) => ({ ...prev, expirationDate: e.target.value }))}
          />
          {errors.expirationDate && <small>{errors.expirationDate}</small>}
        </div>
      </div>
      <div className="form-field">
        <label>Notes</label>
        <textarea value={values.notes} onChange={(e) => setValues((prev) => ({ ...prev, notes: e.target.value }))} />
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="ghost-btn" onClick={onCancel}>
            Annuler
          </button>
        )}
        <button type="submit" className="primary-btn" disabled={saving}>
          {saving ? 'Enregistrement...' : initialData ? 'Mettre à jour' : "Ajouter l'entrée"}
        </button>
      </div>
    </form>
  );
};
