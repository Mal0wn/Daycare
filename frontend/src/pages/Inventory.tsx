import { useEffect, useMemo, useState } from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { FiAlertTriangle, FiEdit3, FiTrash2 } from 'react-icons/fi';
import type { BabyInventoryItem, Child } from '../types';
import { fetchInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../services/api/inventory';
import { fetchChildren } from '../services/api/children';
import { SectionCard } from '../components/common/SectionCard';
import { InventoryForm } from '../components/forms/InventoryForm';
import { formatFrenchDate } from '../utils/date';

interface Filters {
  type: string;
  childId: string;
  dateReceived: string;
  expirationDate: string;
}

// Filters start empty enabling progressive narrowing.
const defaultFilters: Filters = { type: '', childId: '', dateReceived: '', expirationDate: '' };

// Translate expiration difference to user-friendly status + style.
const expirationStatus = (date: string) => {
  const diff = differenceInCalendarDays(parseISO(date), new Date());
  if (diff < 0) return { label: 'Expiré', tone: 'danger' };
  if (diff <= 4) return { label: 'Bientôt périmé', tone: 'warning' };
  return { label: 'OK', tone: 'success' };
};

// Inventory page highlights alerts, filters, table, and form.
export const Inventory = () => {
  const [items, setItems] = useState<BabyInventoryItem[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [editing, setEditing] = useState<BabyInventoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [inventoryData, childrenData] = await Promise.all([fetchInventory(), fetchChildren()]);
      setItems(inventoryData);
      setChildren(childrenData);
      setLoading(false);
    };
    load();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.childId && item.childId !== filters.childId) return false;
      if (filters.dateReceived && item.dateReceived !== filters.dateReceived) return false;
      if (filters.expirationDate && item.expirationDate !== filters.expirationDate) return false;
      return true;
    });
  }, [items, filters]);

  const alerts = filteredItems.filter((item) => {
    const { tone } = expirationStatus(item.expirationDate);
    return tone !== 'success';
  });

  const handleSubmit = async (values: Omit<BabyInventoryItem, 'id'>) => {
    if (editing) {
      const updated = await updateInventoryItem(editing.id, values);
      setItems((prev) => prev.map((item) => (item.id === editing.id ? updated : item)));
      setEditing(null);
    } else {
      const created = await createInventoryItem(values);
      setItems((prev) => [...prev, created]);
    }
  };

  const removeItem = async (id: string) => {
    await deleteInventoryItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resolveChildName = (id: string) => {
    const child = children.find((c) => c.id === id);
    return child ? `${child.firstName} ${child.lastName}` : '—';
  };

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="page">
      <SectionCard
        title="Alertes frigo"
        action={
          <p>
            {alerts.length} alerte{alerts.length > 1 ? 's' : ''} <FiAlertTriangle />
          </p>
        }
      >
        {loading && <p>Chargement de l'inventaire...</p>}
        {alerts.length === 0 && <p>Tous les produits sont frais.</p>}
        {alerts.length > 0 && (
          <ul className="alert-list">
            {alerts.map((item) => {
              const status = expirationStatus(item.expirationDate);
              return (
                <li key={item.id} className={status.tone}>
                  <strong>{resolveChildName(item.childId)}</strong> — {item.brand} ({status.label})
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="Inventaire détaillé"
        action={
          <div className="filters">
            <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
              <option value="">Type</option>
              <option value="Lait infantile">Lait infantile</option>
              <option value="Lait maternel">Lait maternel</option>
              <option value="Eau">Eau</option>
            </select>
            <select value={filters.childId} onChange={(e) => handleFilterChange('childId', e.target.value)}>
              <option value="">Enfant</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName}
                </option>
              ))}
            </select>
            <input type="date" value={filters.dateReceived} onChange={(e) => handleFilterChange('dateReceived', e.target.value)} />
            <input type="date" value={filters.expirationDate} onChange={(e) => handleFilterChange('expirationDate', e.target.value)} />
          </div>
        }
      >
        <table className="data-table">
          <thead>
            <tr>
              <th>Enfant</th>
              <th>Type</th>
              <th>Marque</th>
              <th>Qté</th>
              <th>Entrée</th>
              <th>Expiration</th>
              <th>Statut</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const status = expirationStatus(item.expirationDate);
              return (
                <tr key={item.id}>
                  <td>{resolveChildName(item.childId)}</td>
                  <td>{item.type}</td>
                  <td>{item.brand}</td>
                  <td>
                    {item.quantity} {item.unit}
                  </td>
                  <td>{formatFrenchDate(item.dateReceived)}</td>
                  <td>{formatFrenchDate(item.expirationDate)}</td>
                  <td>
                    <span className={`badge ${status.tone}`}>{status.label}</span>
                  </td>
                  <td>{item.notes}</td>
                  <td className="table-actions">
                    <button className="ghost-btn" onClick={() => setEditing(item)}>
                      <FiEdit3 />
                    </button>
                    <button className="ghost-btn" onClick={() => removeItem(item.id)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title={editing ? 'Modifier une entrée' : 'Ajouter au frigo'}>
        <InventoryForm childrenOptions={children} initialData={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      </SectionCard>
    </div>
  );
};
