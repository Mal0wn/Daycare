import { useEffect, useMemo, useState } from 'react';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';
import type { Child, StaffMember } from '../types';
import { fetchStaff, createStaff, updateStaff, deleteStaff } from '../services/api/staff';
import { fetchChildren, createChild, updateChild, deleteChild } from '../services/api/children';
import { SectionCard } from '../components/common/SectionCard';
import { StaffForm } from '../components/forms/StaffForm';
import { ChildForm } from '../components/forms/ChildForm';
import { Tag } from '../components/common/Tag';
import { DAY_KEYS, dayLabels, getDailyCapacity } from '../utils/date';

// Normalize string comparisons for attendance parsing.
const normalizePattern = (pattern: string) => pattern.toLowerCase();
const getSlotTone = (slot?: { morning: boolean; afternoon: boolean }) => {
  if (!slot?.morning && !slot?.afternoon) return 'pill--none';
  if (slot.morning && slot.afternoon) return 'pill--full';
  if (slot.morning) return 'pill--am';
  return 'pill--pm';
};

// Page combining staff/children planning plus CRUD forms.
export const Schedules = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [staffData, childrenData] = await Promise.all([fetchStaff(), fetchChildren()]);
      setStaff(staffData);
      setChildren(childrenData);
      setLoading(false);
    };
    load();
  }, []);

  const capacity = useMemo(() => getDailyCapacity(staff), [staff]);

  const childrenLoad = useMemo(() => {
    return DAY_KEYS.reduce((acc, day) => {
      const label = dayLabels[day].toLowerCase();
      const count = children.filter((child) => normalizePattern(child.attendancePattern).includes(label)).length;
      acc[day] = count;
      return acc;
    }, {} as Record<string, number>);
  }, [children]);

  const handleStaffSubmit = async (values: Omit<StaffMember, 'id'>) => {
    if (editingStaff) {
      const updated = await updateStaff(editingStaff.id, values);
      setStaff((prev) => prev.map((item) => (item.id === editingStaff.id ? updated : item)));
      setEditingStaff(null);
    } else {
      const created = await createStaff(values);
      setStaff((prev) => [...prev, created]);
    }
  };

  const handleChildSubmit = async (values: Omit<Child, 'id'>) => {
    if (editingChild) {
      const updated = await updateChild(editingChild.id, values);
      setChildren((prev) => prev.map((item) => (item.id === editingChild.id ? updated : item)));
      setEditingChild(null);
    } else {
      const created = await createChild(values);
      setChildren((prev) => [...prev, created]);
    }
  };

  const removeStaff = async (id: string) => {
    await deleteStaff(id);
    setStaff((prev) => prev.filter((item) => item.id !== id));
  };

  const removeChild = async (id: string) => {
    await deleteChild(id);
    setChildren((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return <p>Chargement des plannings...</p>;
  }

  return (
    <div className="page">
      <SectionCard title="Capacité hebdomadaire">
        <div className="planning-summary">
          {DAY_KEYS.map((day) => {
            const total = capacity[day];
            const booked = childrenLoad[day];
            const exceeded = booked > total;
            return (
              <div key={day} className={`summary-pill ${exceeded ? 'danger' : ''}`}>
                <p>{dayLabels[day]}</p>
                <strong>
                  {booked}/{total} enfants
                </strong>
                {exceeded && <small>⚠ Capacité dépassée</small>}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid grid-2">
        <SectionCard title="Équipe & créneaux">
          <div className="responsive-cards">
            {staff.map((member) => (
              <article key={member.id} className="responsive-card">
                <header className="responsive-card__header">
                  <div>
                    <p className="responsive-card__eyebrow">{member.role}</p>
                    <h3>{member.name}</h3>
                  </div>
                  <span className="badge">
                    Capacité: <strong>{member.maxChildrenCapacity}</strong>
                  </span>
                </header>
                <div className="responsive-chip-row">
                  {DAY_KEYS.map((day) => {
                    const slot = member.schedule[day];
                    return (
                      <span key={`${member.id}-${day}`} className={`pill ${getSlotTone(slot)}`}>
                        {dayLabels[day]}
                      </span>
                    );
                  })}
                </div>
                <div className="responsive-card__actions">
                  <button className="ghost-btn" onClick={() => setEditingStaff(member)}>
                    <FiEdit3 /> Modifier
                  </button>
                  <button className="ghost-btn" onClick={() => removeStaff(member.id)}>
                    <FiTrash2 /> Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={editingStaff ? `Modifier ${editingStaff.name}` : 'Ajouter un membre'}>
          <StaffForm initialData={editingStaff ?? undefined} onSubmit={handleStaffSubmit} onCancel={() => setEditingStaff(null)} />
        </SectionCard>
      </div>

      <div className="grid grid-2">
        <SectionCard title="Présence des enfants">
          <div className="responsive-cards">
            {children.map((child) => (
              <article key={child.id} className="responsive-card">
                <header className="responsive-card__header">
                  <div>
                    <p className="responsive-card__eyebrow">Enfant</p>
                    <h3>
                      {child.firstName} {child.lastName}
                    </h3>
                  </div>
                  <Tag label={child.ageGroup} />
                </header>
                <p className="responsive-card__label">Présence</p>
                <p className="responsive-card__notes">{child.attendancePattern}</p>
                <div className="responsive-card__actions">
                  <button className="ghost-btn" onClick={() => setEditingChild(child)}>
                    <FiEdit3 /> Modifier
                  </button>
                  <button className="ghost-btn" onClick={() => removeChild(child.id)}>
                    <FiTrash2 /> Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={editingChild ? `Modifier ${editingChild.firstName}` : 'Nouvelle inscription'}>
          <ChildForm initialData={editingChild ?? undefined} onSubmit={handleChildSubmit} onCancel={() => setEditingChild(null)} />
        </SectionCard>
      </div>
    </div>
  );
};
