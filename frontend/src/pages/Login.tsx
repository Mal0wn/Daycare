import { type FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api/client';
import { useAuth } from '../hooks/useAuth';

// Simple login form for demo auth.
export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<'direction' | 'parent'>('direction');
  const [email, setEmail] = useState('direction@creche.fr');
  const [password, setPassword] = useState('arcenciel');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const PARENT_AUTH_KEY = 'parent-auth';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
        <form className="card-form" onSubmit={handleSubmit}>
          <div className="chips">
            <button
              type="button"
              className={`chip ${role === 'direction' ? 'chip--active' : ''}`}
              onClick={() => {
                setRole('direction');
                setEmail('direction@creche.fr');
                setPassword('arcenciel');
              }}
            >
              Direction
            </button>
            <button
              type="button"
              className={`chip ${role === 'parent' ? 'chip--active' : ''}`}
              onClick={() => {
                setRole('parent');
                setEmail('parent.elise@demo.fr');
                setPassword('parent123');
              }}
            >
              Parent
            </button>
          </div>
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
        <p className="auth-hint">
          Direction → direction@creche.fr / arcenciel · Parent démo → parent.elise@demo.fr / parent123
        </p>
      </div>
    </div>
  );
};
