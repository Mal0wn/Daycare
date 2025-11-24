import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api/client';
import { useAuth } from '../hooks/useAuth';

// Simple login form for demo auth.
export const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialRoleParam = searchParams.get('role') === 'parent' ? 'parent' : 'direction';
  const [role, setRole] = useState<'direction' | 'parent'>(initialRoleParam);
  const [email, setEmail] = useState(initialRoleParam === 'parent' ? 'parent.elise@demo.fr' : 'direction@creche.fr');
  const [password, setPassword] = useState(initialRoleParam === 'parent' ? 'parent123' : 'arcenciel');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const PARENT_AUTH_KEY = 'parent-auth';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const syncRole = (nextRole: 'direction' | 'parent') => {
    setRole(nextRole);
    setEmail(nextRole === 'parent' ? 'parent.elise@demo.fr' : 'direction@creche.fr');
    setPassword(nextRole === 'parent' ? 'parent123' : 'arcenciel');
    setSearchParams({ role: nextRole });
  };

  const isDirection = useMemo(() => role === 'direction', [role]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      setLoading(true);
      if (role === 'direction') {
        await login(email, password);
        const redirect = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
        navigate(redirect, { replace: true });
      } else {
        const { data } = await api.post('/parent/login', { email, password });
        localStorage.setItem(PARENT_AUTH_KEY, JSON.stringify({ token: data.token, name: data.user.name, email: data.user.email }));
        navigate('/parents', { replace: true });
      }
    } catch (err) {
      setError("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <p className="auth-card__eyebrow">Espace sécurisé</p>
          <h1>Connexion</h1>
          <p className="auth-card__muted">Choisissez votre profil puis entrez vos identifiants.</p>
        </div>
        <div className="auth-switch">
          <span className="auth-switch__label">Parent</span>
          <label className="auth-toggle">
            <input
              type="checkbox"
              aria-label="Basculer vers Direction"
              checked={isDirection}
              onChange={(e) => syncRole(e.target.checked ? 'direction' : 'parent')}
            />
            <span className="auth-toggle__slider" aria-hidden="true" />
          </label>
          <span className="auth-switch__label">Direction</span>
        </div>
        <form className="card-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};
