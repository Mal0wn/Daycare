import { useEffect, useState } from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import type { Child } from '../types';
import { fetchChildren, createChild, updateChild, deleteChild } from '../services/api/children';
import { SectionCard } from '../components/common/SectionCard';
import { ChildForm } from '../components/forms/ChildForm';
import { computeAge, formatFrenchDate } from '../utils/date';

// Children management page listing cards + CRUD form.
export const Children = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Child | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchChildren();
      setChildren(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleSubmit = async (values: Omit<Child, 'id'>) => {
    if (editing) {
      const updated = await updateChild(editing.id, values);
      setChildren((prev) => prev.map((item) => (item.id === editing.id ? updated : item)));
      setEditing(null);
    } else {
      const created = await createChild(values);
      setChildren((prev) => [...prev, created]);
    }
  };

  const removeChild = async (id: string) => {
    await deleteChild(id);
    setChildren((prev) => prev.filter((child) => child.id !== id));
  };

  return (
    <div className="page">
      <SectionCard title="Enfants inscrits">
        {loading && <p>Chargement...</p>}
        <div className="cards">
          {children.map((child) => (
            <article key={child.id} className="child-card">
              <header>
                <h3>
                  {child.firstName} {child.lastName}
                </h3>
                <span className="badge">{child.ageGroup}</span>
              </header>
              <p>
                Âge : <strong>{computeAge(child.birthDate)} ans</strong>
              </p>
              <p>Né(e) le {formatFrenchDate(child.birthDate)}</p>
              <p>Présence : {child.attendancePattern}</p>
              <div className="table-actions">
                <button className="ghost-btn" onClick={() => setEditing(child)}>
                  <FiEdit3 />
                </button>
                <button className="ghost-btn" onClick={() => removeChild(child.id)}>
                  <FiTrash2 />
                </button>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
      <SectionCard title={editing ? `Modifier ${editing.firstName}` : 'Ajouter un enfant'}>
        <ChildForm initialData={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      </SectionCard>
    </div>
  );
};
