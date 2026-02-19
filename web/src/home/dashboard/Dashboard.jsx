import { Plus } from 'lucide-react';
import { useModal } from '../../common/hooks/useActive';
import { useAuth } from '../../auth/shared/hooks/useAuth';
import { useNotebook } from '../../notebook/shared/hooks/useNotebook';
import NewNoteBookModal from '../shared/components/NewNotebookModal';
import Notebook from '../shared/components/Notebook';
import './styles/dashboard.css';

import { getGreeting } from './Dashboard.utils';

const Dashboard = () => {
  const { user } = useAuth();
  const name = user?.username || 'there';
  const { active: showNewNotebookModal, activate, deactivate } = useModal();
  const { notebooks } = useNotebook();
  const openNewNotebookModal = () => {
    activate();
  };

  const closeNewNotebookModal = () => {
    deactivate();
  };


  return (
    <div className="dashboard-page">
      <header className="dashboard-welcome">
        <h1 className="dashboard-greeting">{getGreeting()}, {name}</h1>
        <p className="dashboard-tagline">What do you want to learn today?</p>
      </header>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Continue learning</h2>
        </div>
        <div className="dashboard-continue">
          {notebooks.slice(0, 2).map(notebook => (
            <Notebook key={notebook.id} notebook={notebook} />
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Your library</h2>
        </div>
        <div className="dashboard-library-grid">
          <button type="button" className="dashboard-library-card new-notebook" onClick={openNewNotebookModal}>
            <div className="dashboard-library-card-icon">
              <Plus size={28} strokeWidth={2} />
            </div>
            <span>New notebook</span>
          </button>
          {notebooks.map(notebook => (
            <Notebook key={notebook.id} notebook={notebook} variant="library" />
          ))}
        </div>
      </section>

      <div className="dashboard-stats">
        <span className="dashboard-stat"><strong>{notebooks.length}</strong> {notebooks.length > 1 ? ' notebooks' : ' notebook'}</span>
      </div>

      <NewNoteBookModal
        isOpen={showNewNotebookModal}
        onClose={closeNewNotebookModal}
      >
      </NewNoteBookModal>
    </div>
  );
};

export default Dashboard;
