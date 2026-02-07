import { useState, useMemo } from 'react';
import { Search, Plus, SortAsc, Clock, Folder, FileText, ChevronRight, ChevronDown, MoreVertical, LayoutGrid, List } from 'lucide-react';

const NoteList = ({ documents, categories, onAddDocument, onSelectDocument, viewMode, setViewMode }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleCategory = (categoryName) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    const filteredDocuments = useMemo(() => {
        let filtered = documents.filter(doc => 
            doc.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return filtered.sort((a, b) => {
            if (sortBy === 'name') return a.title.localeCompare(b.title);
            if (sortBy === 'date') return new Date(b.lastEdited) - new Date(a.lastEdited);
            return 0;
        });
    }, [documents, searchQuery, sortBy]);

    const groupedByCategories = useMemo(() => {
        const grouped = {};
        categories.forEach(cat => grouped[cat.name] = []);
        grouped['Uncategorized'] = [];

        filteredDocuments.forEach(doc => {
            const cat = doc.category || 'Uncategorized';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(doc);
        });
        return grouped;
    }, [filteredDocuments, categories]);

    return (
        <div className="document-list-container">
            <div className="list-controls">
                <div className="search-bar">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search documents..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-sort-controls">
                    <div className="view-toggle">
                        <button 
                            className={`toggle-btn ${viewMode === 'categories' ? 'active' : ''}`}
                            onClick={() => setViewMode('categories')}
                            title="Category View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button 
                            className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
                            onClick={() => setViewMode('all')}
                            title="All Documents"
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <div className="sort-dropdown">
                        <SortAsc size={18} />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="name">A-Z</option>
                            <option value="date">Recent</option>
                        </select>
                    </div>
                    <button className="add-btn primary" onClick={onAddDocument}>
                        <Plus size={18} />
                        <span>Add New</span>
                    </button>
                </div>
            </div>

            <div className="documents-display">
                {viewMode === 'categories' ? (
                    <div className="categories-folders">
                        {Object.entries(groupedByCategories).map(([category, docs]) => (
                            <div key={category} className="category-folder-group">
                                <div 
                                    className={`category-folder-header ${expandedCategories[category] ? 'expanded' : ''}`}
                                    onClick={() => toggleCategory(category)}
                                >
                                    <div className="folder-info">
                                        {expandedCategories[category] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        <Folder size={20} className="folder-icon" />
                                        <span className="category-name">{category}</span>
                                        <span className="doc-count">{docs.length}</span>
                                    </div>
                                </div>
                                {expandedCategories[category] && (
                                    <div className="folder-contents">
                                        {docs.length > 0 ? (
                                            docs.map(doc => (
                                                <div key={doc.id} className="document-row-item" onClick={() => onSelectDocument(doc)}>
                                                    <FileText size={16} className="doc-icon" />
                                                    <span className="doc-title">{doc.title}</span>
                                                    <span className="doc-date">{doc.lastEdited}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="empty-folder">No documents in this category</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="documents-grid">
                        {filteredDocuments.length > 0 ? (
                            filteredDocuments.map(doc => (
                                <div key={doc.id} className="document-card" onClick={() => onSelectDocument(doc)}>
                                    <div className="document-card-icon">
                                        <FileText size={24} />
                                    </div>
                                    <div className="document-card-info">
                                        <h3>{doc.title}</h3>
                                        <div className="document-meta">
                                            <span className="category-tag">{doc.category}</span>
                                            <span className="last-edited">
                                                <Clock size={12} />
                                                {doc.lastEdited}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="icon-button mini more-options" onClick={(e) => e.stopPropagation()}>
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="no-documents">
                                <p>No documents found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteList;
