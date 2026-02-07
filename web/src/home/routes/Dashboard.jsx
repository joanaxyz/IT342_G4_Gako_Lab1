import { Play, Clock, Book, MoreVertical } from 'lucide-react';
import '../styles/dashboard.css';

const Dashboard = () => {
    // Mock data for the dashboard
    const resumeEditing = [
        { id: 1, title: 'Operating Systems - Chapter 4', type: 'Document', lastEdited: '2 hours ago' },
        { id: 2, title: 'Database Normalization Notes', type: 'Document', lastEdited: '5 hours ago' },
    ];

    const resumeReview = [
        { id: 1, title: 'Midterm Review - Data Structures', count: 45, type: 'Flashcards' },
    ];

    const subjectCards = [
        { id: 1, title: 'Computer Science', docCount: 12, updated: 'Today' },
        { id: 2, title: 'Mathematics', docCount: 5, updated: 'Yesterday' },
        { id: 3, title: 'History', docCount: 8, updated: '3 days ago' },
    ];

    const recentlyEdited = [
        { id: 1, title: 'Quantum Physics Intro', lastEdited: '1 hour ago', type: 'Note' },
        { id: 2, title: 'Calculus III - Integration', lastEdited: '4 hours ago', type: 'Note' },
        { id: 3, title: 'French Vocabulary', lastEdited: 'Yesterday', type: 'List' },
    ];

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Welcome back!</h1>
                <p>Pick up where you left off.</p>
            </header>

            <div className="dashboard-grid">
                {/* Resume Editing Section */}
                <section className="dashboard-section">
                    <h2 className="section-title">Resume editing</h2>
                    <div className="cards-container vertical">
                        {resumeEditing.map(doc => (
                            <div key={doc.id} className="resume-card">
                                <div className="card-icon document-icon">
                                    <Book size={20} />
                                </div>
                                <div className="card-info">
                                    <h3>{doc.title}</h3>
                                    <p>Edited {doc.lastEdited}</p>
                                </div>
                                <button className="resume-button primary">Resume</button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Resume Review Section */}
                <section className="dashboard-section">
                    <h2 className="section-title">Resume review</h2>
                    <div className="cards-container vertical">
                        {resumeReview.map(review => (
                            <div key={review.id} className="resume-card review-card">
                                <div className="card-info">
                                    <h3>{review.title}</h3>
                                    <p>{review.count} items to review</p>
                                </div>
                                <button className="resume-button secondary">
                                    <Play size={16} />
                                    Resume
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Subject Cards Section */}
            <section className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">Subjects</h2>
                    <button className="text-button">View all</button>
                </div>
                <div className="cards-grid">
                    {subjectCards.map(subject => (
                        <div key={subject.id} className="subject-card">
                            <div className="subject-card-content">
                                <h3>{subject.title}</h3>
                                <p>{subject.docCount} documents</p>
                                <span className="update-tag">Updated {subject.updated}</span>
                            </div>
                            <button className="icon-button mini">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recently Edited Section */}
            <section className="dashboard-section">
                <h2 className="section-title">Recently edited</h2>
                <div className="recent-list">
                    <div className="recent-header">
                        <span>Name</span>
                        <span>Last edited</span>
                    </div>
                    {recentlyEdited.map(item => (
                        <div key={item.id} className="recent-item">
                            <div className="recent-item-info">
                                <Clock size={16} className="text-secondary" />
                                <span>{item.title}</span>
                            </div>
                            <span className="recent-date">{item.lastEdited}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
