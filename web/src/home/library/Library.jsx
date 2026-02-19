import { useNotebook } from '../../notebook/shared/hooks/useNotebook';
import Notebook from '../shared/components/Notebook';
import '../dashboard/styles/dashboard.css';

const Library = () => {
  const { notebooks } = useNotebook();

  return (
    <div className="dashboard-page">
      <header className="dashboard-welcome">
        <h1 className="dashboard-greeting">Library</h1>
        <p className="dashboard-tagline">All your learning notebooks in one place.</p>
      </header>
      <section className="dashboard-section">
        {notebooks.length === 0 ? (
          <p className="dashboard-empty">
            Your notebooks will appear here. Create one from the dashboard to get started.
          </p>
        ) : (
          <div className="dashboard-library-grid">
            {notebooks.map(notebook => (
              <Notebook key={notebook.id} notebook={notebook} variant="library" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Library;
