import '../styles/dashboard.css';

const Quizzes = () => {
  return (
    <div className="dashboard-page">
      <header className="dashboard-welcome">
        <h1 className="dashboard-greeting">Quizzes</h1>
        <p className="dashboard-tagline">Test your understanding with quizzes from your notebooks.</p>
      </header>
      <section className="dashboard-section">
        <p className="dashboard-empty">
          Quizzes will appear here. They can be generated from your sections or created manually.
        </p>
      </section>
    </div>
  );
};

export default Quizzes;
