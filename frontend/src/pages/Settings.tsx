import { SectionCard } from '../components/common/SectionCard';
import { useTheme } from '../hooks/useTheme';

const accentOptions = ['#f6b2c0', '#fdd5a5', '#a0e1d6', '#c7c2ff', '#ffd6f2'];

// Settings centralize theme toggles + accent selection.
export const Settings = () => {
  const { mode, toggleMode, accent, setAccent } = useTheme();

  return (
    <div className="page">
      <SectionCard title="Mode visuel">
        <p>Choisissez l'ambiance pour l'interface de la crèche.</p>
        <button className="primary-btn" onClick={toggleMode}>
          Passer en mode {mode === 'light' ? 'sombre' : 'clair'}
        </button>
      </SectionCard>

      <SectionCard title="Couleur pastel principale">
        <p>Cette couleur colore les boutons, liens et tags importants.</p>
        <div className="accent-grid">
          {accentOptions.map((color) => (
            <button
              key={color}
              className={`accent-swatch ${accent === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setAccent(color)}
            />
          ))}
        </div>
        <p>Préférences enregistrées localement sur cet appareil.</p>
      </SectionCard>
    </div>
  );
};
