import '../dashboard/styles/dashboard.css';

const Flashcards = () => {
  return (
    <div className="dashboard-page">
      <header className="dashboard-welcome">
        <h1 className="dashboard-greeting">Flashcards</h1>
        <p className="dashboard-tagline">Review and memorize with flashcards from your content.</p>
      </header>
      <section className="dashboard-section">
        <p className="dashboard-empty">
          Flashcards will appear here. Create decks from your notebooks or add your own cards.
        </p>
      </section>
    </div>
  );
};

export default Flashcards;
