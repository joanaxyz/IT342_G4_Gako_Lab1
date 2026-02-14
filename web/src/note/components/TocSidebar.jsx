import { useState } from 'react';
import { List, Plus, ChevronDown } from 'lucide-react';

const TocSidebar = ({
  sections,
  activeSectionId,
  onSelectSection,
  onAddTopLevel,
  onAddChild,
  onAddAfter,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const renderSection = (section, depth = 0) => (
    <div key={section.id} className="toc-item-wrapper" style={{ '--depth': depth }}>
      <div
        className={`toc-row ${activeSectionId === section.id ? 'active' : ''}`}
        onMouseLeave={() => setOpenMenuId(null)}
      >
        <button
          type="button"
          className="toc-item"
          onClick={() => onSelectSection(section.id)}
        >
          <span className="toc-item-title">{section.title || 'Untitled section'}</span>
        </button>
        <div className="toc-row-actions">
          <button
            type="button"
            className="toc-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === section.id ? null : section.id);
            }}
            aria-label="Add section"
            aria-expanded={openMenuId === section.id}
            aria-haspopup="true"
          >
            <Plus size={16} strokeWidth={2} />
            <ChevronDown size={14} strokeWidth={2} />
          </button>
          {openMenuId === section.id && (
            <div className="toc-add-menu" role="menu">
              <button
                type="button"
                className="toc-add-menu-item"
                role="menuitem"
                onClick={() => {
                  onAddChild(section.id);
                  setOpenMenuId(null);
                }}
              >
                Add sub-section
              </button>
              <button
                type="button"
                className="toc-add-menu-item"
                role="menuitem"
                onClick={() => {
                  onAddAfter(section.id);
                  setOpenMenuId(null);
                }}
              >
                Add section after
              </button>
            </div>
          )}
        </div>
      </div>
      {section.children?.length > 0 && (
        <div className="toc-children">
          {section.children.map((child) => renderSection(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <aside className="toc-sidebar">
      <div className="toc-sidebar-header">
        <List size={18} strokeWidth={1.75} />
        <span>Table of contents</span>
      </div>
      <nav className="toc-nav" aria-label="Document sections">
        {sections.map((section) => renderSection(section))}
      </nav>
      <button type="button" className="toc-add-section" onClick={onAddTopLevel}>
        <Plus size={18} strokeWidth={2} />
        <span>Add section</span>
      </button>
    </aside>
  );
};

export default TocSidebar;
