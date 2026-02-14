import '../styles/dashboard.css';

const Library = () => {
  return (
    <div className="dashboard-page">
      <header className="dashboard-welcome">
        <h1 className="dashboard-greeting">Library</h1>
        <p className="dashboard-tagline">All your learning notebooks in one place.</p>
      </header>
      <section className="dashboard-section">
        <p className="dashboard-empty">
          Your notebooks will appear here. Create one from the dashboard to get started.
        </p>
      </section>
    </div>
  );
};

export default Library;
