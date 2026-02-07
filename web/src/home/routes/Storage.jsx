import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from '../components/storage/NoteList';
import '../styles/storage.css';

const Storage = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('categories'); // 'categories' or 'all'
    const [documents, setDocuments] = useState([
        { id: '1', title: 'Operating Systems - Chapter 4', category: 'Computer Science', lastEdited: '2026-02-06', content: '<h1>OS Chapter 4</h1><p>Process management and scheduling...</p>' },
        { id: '2', title: 'Database Normalization Notes', category: 'Computer Science', lastEdited: '2026-02-05', content: '<h1>Normalization</h1><p>1NF, 2NF, 3NF...</p>' },
        { id: '3', title: 'Calculus III - Integration', category: 'Mathematics', lastEdited: '2026-02-04', content: '<h1>Integration</h1><p>Multiple integrals...</p>' },
    ]);

    const categories = [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Mathematics' },
        { id: 3, name: 'History' },
    ];

    const handleAddDocument = () => {
        navigate('/document/new');
    };

    const handleSelectDocument = (doc) => {
        navigate(`/document/${doc.id}`);
    };

    return (
        <div className="storage-page">
            <header className="storage-header">
                <h1>Storage</h1>
                <p>Manage your learning materials and notes.</p>
            </header>
            <NoteList 
                documents={documents} 
                categories={categories}
                onAddDocument={handleAddDocument}
                onSelectDocument={handleSelectDocument}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />
        </div>
    );
};

export default Storage;
