import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Schedules } from './pages/Schedules';
import { Activities } from './pages/Activities';
import { Inventory } from './pages/Inventory';
import { Children } from './pages/Children';
import { Settings } from './pages/Settings';
import './App.css';

// Root app wires all routes into the main layout shell.
function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plannings" element={<Schedules />} />
          <Route path="/activites" element={<Activities />} />
          <Route path="/inventaire" element={<Inventory />} />
          <Route path="/enfants" element={<Children />} />
          <Route path="/parametres" element={<Settings />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
