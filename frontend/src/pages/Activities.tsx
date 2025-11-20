import { useEffect, useMemo, useState } from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import type { Activity } from '../types';
import { fetchActivities, createActivity, updateActivity, deleteActivity } from '../services/api/activities';
import { SectionCard } from '../components/common/SectionCard';
import { ActivityForm } from '../components/forms/ActivityForm';
import { Tag } from '../components/common/Tag';
import { getTodayKey } from '../utils/date';

const filters = [
  { key: 'today', label: "Aujourd'hui" },
  { key: 'past', label: 'Souvenirs' },
  { key: 'all', label: 'Toutes' }
] as const;

type FilterKey = (typeof filters)[number]['key'];

// Activities view offers filters, cards, and CRUD form sidebar.
export const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('today');
  const [editing, setEditing] = useState<Activity | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchActivities();
      setActivities(data);
      setLoading(false);
    };
    load();
  }, []);

  const today = getTodayKey();

  const filteredActivities = useMemo(() => {
    if (filter === 'today') return activities.filter((activity) => activity.weekday === today);
    if (filter === 'past') return activities.filter((activity) => activity.pictures.length > 0);
    return activities;
  }, [activities, filter, today]);

  const handleSubmit = async (values: Omit<Activity, 'id'>) => {
    if (editing) {
      const updated = await updateActivity(editing.id, values);
      setActivities((prev) => prev.map((item) => (item.id === editing.id ? updated : item)));
      setEditing(null);
    } else {
      const created = await createActivity(values);
      setActivities((prev) => [...prev, created]);
    }
  };

  const removeActivity = async (id: string) => {
    await deleteActivity(id);
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
  };

  return (
    <div className="page">
      <SectionCard title="Activités créatives" action={
        <div className="chips">
          {filters.map((item) => (
            <button key={item.key} className={`chip ${filter === item.key ? 'chip--active' : ''}`} onClick={() => setFilter(item.key)}>
              {item.label}
            </button>
          ))}
        </div>
      }>
        {loading && <p>Chargement des activités...</p>}
        <div className="activity-grid">
          {filteredActivities.map((activity) => (
            <article key={activity.id} className="activity-card">
              <div className="activity-card__header">
                <div>
                  <h3>{activity.name}</h3>
                  <span className="badge">{activity.weekday}</span>
                </div>
                <div className="table-actions">
                  <button className="ghost-btn" onClick={() => setEditing(activity)}>
                    <FiEdit3 />
                  </button>
                  <button className="ghost-btn" onClick={() => removeActivity(activity.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <p>{activity.description}</p>
              <div className="activity-card__tags">
                {activity.ageGroups.map((group) => (
                  <Tag key={`${activity.id}-${group}`} label={group} />
                ))}
              </div>
              {activity.pictures.length > 0 && (
                <div className="activity-photos">
                  {activity.pictures.map((photo) => (
                    <img key={photo} src={photo} alt="Souvenir" width={200} height={300} loading="lazy" />
                  ))}
                </div>
              )}
              <small>{activity.maxChildren} places</small>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={editing ? `Modifier ${editing.name}` : 'Programmer une nouvelle activité'}>
        <ActivityForm initialData={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      </SectionCard>
    </div>
  );
};
