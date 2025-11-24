import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api/client';
import type { Activity, BabyInventoryItem } from '../types';

interface ParentAuthState {
  token: string | null;
  name: string | null;
  email: string | null;
}

const STORAGE_KEY = 'parent-auth';

// Public parent portal: login + read-only views of their child inventory and activities.
export const ParentPortal = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState<ParentAuthState>(() => {
    if (typeof window === 'undefined') return { token: null, name: null, email: null };
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, name: null, email: null };
  });
  const [email, setEmail] = useState(auth.email || 'parent.elise@demo.fr');
  const [password, setPassword] = useState('parent123');
  const [inventory, setInventory] = useState<BabyInventoryItem[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const headers = useMemo(() => ({ Authorization: `Bearer ${auth.token}` }), [auth.token]);

  const logout = () => {
    setAuth({ token: null, name: null, email: null });
    setInventory([]);
    setActivities([]);
    navigate('/login?role=parent');
  };

  useEffect(() => {
    const load = async () => {
      if (!auth.token) return;
      setLoading(true);
      try {
        const [invRes, actRes] = await Promise.all([
          api.get<BabyInventoryItem[]>('/parent/inventory', { headers }),
          api.get<Activity[]>('/parent/activities', { headers })
        ]);
        setInventory(invRes.data);
        setActivities(actRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auth.token, headers]);

  useEffect(() => {
    if (!auth.token) {
      navigate('/login?role=parent', { replace: true });
    }
  }, [auth.token, navigate]);

  if (!auth.token) {
    return null;
  }

  return (
    <div className="auth-page">
      <div className="parent-portal">
        <header className="parent-portal__header">
          <div>
            <p className="auth-card__eyebrow">Espace parents</p>
            <h2>Bonjour {auth.name}</h2>
          </div>
          <div className="parent-portal__header-actions">
            <div className="auth-switch">
              <span className="auth-switch__label">Parent</span>
              <label className="auth-toggle">
                <input
                  type="checkbox"
                  aria-label="Basculer vers l'espace Direction"
                  onChange={(e) => {
                    if (e.target.checked) {
                      navigate('/login');
                    }
                  }}
                />
                <span className="auth-toggle__slider" aria-hidden="true" />
              </label>
              <span className="auth-switch__label">Direction</span>
            </div>
            <button className="ghost-btn" onClick={logout}>
              Déconnexion
            </button>
          </div>
        </header>

        <div className="grid grid-2">
          <section className="section-card">
            <header>
              <h3>Stock personnalisé</h3>
            </header>
            {loading && <p>Chargement...</p>}
            {!loading && inventory.length === 0 && <p>Aucun élément en stock pour votre enfant.</p>}
            <div className="responsive-cards">
              {inventory.map((item) => (
                <article key={item.id} className="responsive-card">
                  <header className="responsive-card__header">
                    <div>
                      <p className="responsive-card__eyebrow">{item.type}</p>
                      <h3>{item.brand}</h3>
                    </div>
                    <span className="badge">Quantité : {item.quantity} {item.unit}</span>
                  </header>
                  <div className="responsive-card__grid">
                    <div>
                      <p className="responsive-card__label">Entrée</p>
                      <strong>{item.dateReceived}</strong>
                    </div>
                    <div>
                      <p className="responsive-card__label">Expiration</p>
                      <strong>{item.expirationDate}</strong>
                    </div>
                  </div>
                  {item.notes && <p className="responsive-card__notes">{item.notes}</p>}
                </article>
              ))}
            </div>
          </section>

          <section className="section-card">
            <header>
              <h3>Activités</h3>
            </header>
            {loading && <p>Chargement...</p>}
            <div className="activity-cards">
              {activities.map((activity) => (
                <article key={activity.id} className="activity-card">
                  <div className="activity-card__header">
                    <div>
                      <h3>{activity.name}</h3>
                      <span className="badge">{activity.weekday}</span>
                    </div>
                    <small>{activity.maxChildren} places</small>
                  </div>
                  <p>{activity.description}</p>
                  {activity.pictures?.length > 0 && (
                    <div className="activity-photos">
                      {activity.pictures.map((photo) => (
                        <img key={photo} src={photo} alt={activity.name} width={200} height={300} loading="lazy" />
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
