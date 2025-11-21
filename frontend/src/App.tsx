import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Schedules } from './pages/Schedules';
import { Activities } from './pages/Activities';
import { Inventory } from './pages/Inventory';
import { Children } from './pages/Children';
import { Settings } from './pages/Settings';
import { RequireAuth } from './components/auth/RequireAuth';
import { Login } from './pages/Login';
import './App.css';

// Root app wires all routes into the main layout shell.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/plannings" element={<Schedules />} />
          <Route path="/activites" element={<Activities />} />
          <Route path="/inventaire" element={<Inventory />} />
          <Route path="/enfants" element={<Children />} />
          <Route path="/parametres" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
