import { Link } from 'react-router-dom';
import { BookOpen, Clock, FileText, Plus } from 'lucide-react';
import { useAuth } from '../../auth/hook/useAuth';
import '../styles/dashboard.css';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { user } = useAuth();
  const name = user?.username || 'there';

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
          <Link to="/notebook/1" className="dashboard-continue-card dashboard-continue-card-link">
            <div className="dashboard-continue-icon">
              <BookOpen size={22} strokeWidth={1.75} />
            </div>
            <h3>Introduction to Neuroscience</h3>
            <div className="dashboard-continue-meta">
              <Clock size={14} />
              Last opened 2 hours ago
            </div>
          </Link>
          <div className="dashboard-continue-card">
            <div className="dashboard-continue-icon">
              <BookOpen size={22} strokeWidth={1.75} />
            </div>
            <h3>Cognitive Psychology Basics</h3>
            <div className="dashboard-continue-meta">
              <Clock size={14} />
              Last opened yesterday
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Your library</h2>
        </div>
        <div className="dashboard-library-grid">
          <Link to="/notebook/new" className="dashboard-library-card new-notebook">
            <div className="dashboard-library-card-icon">
              <Plus size={28} strokeWidth={2} />
            </div>
            <span>New notebook</span>
          </Link>
          <Link to="/notebook/1" className="dashboard-library-card dashboard-library-card-link">
            <div className="dashboard-library-card-icon">
              <FileText size={22} strokeWidth={1.75} />
            </div>
            <h3>Introduction to Neuroscience</h3>
            <div className="dashboard-library-meta">5 sections</div>
          </Link>
          <div className="dashboard-library-card">
            <div className="dashboard-library-card-icon">
              <FileText size={22} strokeWidth={1.75} />
            </div>
            <h3>Cognitive Psychology</h3>
            <div className="dashboard-library-meta">8 sections</div>
          </div>
          <div className="dashboard-library-card">
            <div className="dashboard-library-card-icon">
              <FileText size={22} strokeWidth={1.75} />
            </div>
            <h3>Memory & Recall</h3>
            <div className="dashboard-library-meta">4 sections</div>
          </div>
        </div>
      </section>

      <div className="dashboard-stats">
        <span className="dashboard-stat"><strong>3</strong> notebooks</span>
        <span className="dashboard-stat"><strong>17</strong> sections</span>
      </div>
    </div>
  );
};

export default Dashboard;
