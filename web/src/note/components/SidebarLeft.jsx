import { FileText } from 'lucide-react';
import React from 'react';

const SidebarLeft = ({ currentDoc, categoryDocs, categories, onSelectDoc, onChangeCategory }) => {
  if (!currentDoc) return null;

  return (
    <aside className="docs-sidebar">
      <div className="sidebar-section">
        <h4>{currentDoc.category}</h4>
      </div>
      <div className="sidebar-list">
        <div className="sidebar-item active">
          <FileText size={16} />
          <span>{currentDoc.title}</span>
        </div>
        {categoryDocs.map((doc) => (
          <div
            key={doc.id}
            className="sidebar-item"
            onClick={() => onSelectDoc(doc.id)}
          >
            <FileText size={16} />
            <span>{doc.title}</span>
          </div>
        ))}
      </div>
      <div className="category-selector-container">
        <label>Category</label>
        <select
          value={currentDoc.category}
          onChange={(e) => onChangeCategory(e.target.value)}
        >
          <option value="Uncategorized">Uncategorized</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};

export default SidebarLeft;

