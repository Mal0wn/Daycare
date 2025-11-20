import { useEffect, useState } from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { FiActivity, FiAlertTriangle, FiUsers } from 'react-icons/fi';
import { MdEmojiPeople } from 'react-icons/md';
import type { Activity, BabyInventoryItem, Child, StaffMember } from '../types';
import { fetchActivities } from '../services/api/activities';
import { fetchInventory } from '../services/api/inventory';
import { fetchStaff } from '../services/api/staff';
import { fetchChildren } from '../services/api/children';
import { SectionCard } from '../components/common/SectionCard';
import { StatCard } from '../components/common/StatCard';
import { Tag } from '../components/common/Tag';
import { describeRelativeDate, getTodayKey, isChildPresentToday } from '../utils/date';

// Landing page showing snapshot metrics + alerts for the day.
export const Dashboard = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [inventory, setInventory] = useState<BabyInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [staffData, childrenData, activitiesData, inventoryData] = await Promise.all([
        fetchStaff(),
        fetchChildren(),
        fetchActivities(),
        fetchInventory()
      ]);
      setStaff(staffData);
      setChildren(childrenData);
      setActivities(activitiesData);
      setInventory(inventoryData);
      setLoading(false);
    };
    load();
  }, []);

  const todayKey = getTodayKey();
  // Derived values for summary cards.
  const staffPresent = staff.filter((member) => {
    const slot = member.schedule?.[todayKey];
    return slot?.morning || slot?.afternoon;
  }).length;
  const childrenPresent = children.filter((child) => isChildPresentToday(child)).length;
  const todaysActivities = activities.filter((activity) => activity.weekday === todayKey);
  const alerts = inventory.filter((item) => {
    const diff = differenceInCalendarDays(parseISO(item.expirationDate), new Date());
    return diff <= 4;
  });

  if (loading) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div className="page">
      <SectionCard title="Instantanés du jour">
        <div className="grid grid-4">
          <StatCard title="Équipe présente" value={staffPresent} highlight={`${staff.length} membres inscrits`} icon={<MdEmojiPeople />} />
          <StatCard title="Enfants attendus" value={childrenPresent} highlight={`${children.length} inscrits`} icon={<FiUsers />} />
          <StatCard title="Activités du jour" value={todaysActivities.length} highlight={todayKey} icon={<FiActivity />} />
          <StatCard title="Alertes frigos" value={alerts.length} highlight="expiration proche" icon={<FiAlertTriangle />} />
        </div>
      </SectionCard>

      <div className="grid grid-2">
        <SectionCard title="Activités prévues aujourd'hui">
          {todaysActivities.length === 0 && <p>Aucune activité spéciale aujourd'hui. Ajoutez-en une !</p>}
          <div className="activity-cards">
            {todaysActivities.map((activity) => (
              <article key={activity.id} className="activity-card">
                <div className="activity-card__header">
                  <h3>{activity.name}</h3>
                  <span className="badge">{activity.weekday}</span>
                </div>
                <p>{activity.description}</p>
                <div className="activity-card__tags">
                  {activity.ageGroups.map((group) => (
                    <Tag key={`${activity.id}-${group}`} label={group} />
                  ))}
                </div>
                <small>{activity.maxChildren} places</small>
              </article>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Alertes d'expiration">
          {alerts.length === 0 && <p>Rien à signaler, les frigos sont en sécurité.</p>}
          <ul className="alert-list">
            {alerts.map((item) => {
              const diff = differenceInCalendarDays(parseISO(item.expirationDate), new Date());
              const status = diff < 0 ? 'Expiré' : diff <= 4 ? 'Bientôt périmé' : 'OK';
              return (
                <li key={item.id} className={diff < 0 ? 'danger' : 'warning'}>
                  <strong>{item.brand}</strong> — {status} ({describeRelativeDate(item.expirationDate)})
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
};
