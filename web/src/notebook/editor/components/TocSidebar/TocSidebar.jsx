import { useState } from 'react';
import { List, Plus, ChevronDown, GripVertical, Check } from 'lucide-react';
import EditableTitle from '../../../../common/components/EditableTitle';
import { useTocDragAndDrop } from './useTocDragAndDrop';

const TocSidebar = ({
  sections,
  activeSectionId,
  onSelectSection,
  onAddTopLevel,
  onAddChild,
  onAddAfter,
  onUpdateSection,
  onReorderSection,
  onReorderSectionBefore,
  onReorderSectionInto,
  onReorderDone,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);

  const {
    draggedId,
    dragOverId,
    dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDrop,
    setDragOverId,
    clearDragOverState,
    clearDragState,
  } = useTocDragAndDrop(isReordering, onReorderSection, onReorderSectionBefore, onReorderSectionInto);

  const renderSection = (section, depth = 0) => (
    <div
      key={section.id}
      className={`toc-item-wrapper ${draggedId === section.id ? 'dragging' : ''}`}
      style={{ '--depth': depth }}
    >
      <div
        className={`toc-row ${activeSectionId === section.id ? 'active' : ''} ${isReordering ? 'reorder-mode' : ''} ${dragOverId === section.id ? `drag-over-${dropIndicator}` : ''}`}
        onMouseLeave={() => setOpenMenuId(null)}
        draggable={isReordering}
        onDragStart={(e) => handleDragStart(e, section.id)}
        onDragEnd={clearDragState}
        onDragOver={(e) => handleDragOver(e, section.id)}
        onDrop={(e) => handleDrop(e, section.id)}
      >
        {isReordering && (
          <div className="toc-drag-handle">
            <GripVertical size={14} />
          </div>
        )}
        <div className="toc-item-main" onClick={() => !isReordering && onSelectSection(section.id)}>
          <EditableTitle
            tag="span"
            initialTitle={section.title}
            onSave={(newTitle) => onUpdateSection(section.id, { title: newTitle })}
            className="toc-item-title"
            readonly={isReordering}
          />
          {isReordering && dragOverId === section.id && dropIndicator === 'into' && (
            <span className="toc-drop-hint">Add as sub-section</span>
          )}
        </div>
        {!isReordering && (
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
        )}
      </div>
      {section.children?.length > 0 && (
        <div className="toc-children">
          {section.children.map((child) => renderSection(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <aside className={`toc-sidebar ${isReordering ? 'is-reordering' : ''}`}>
      <div className="toc-sidebar-header">
        <div className="toc-sidebar-header-title">
          <List size={18} strokeWidth={1.75} />
          <span>Table of contents</span>
        </div>
        <button
          type="button"
          className={`toc-reorder-toggle ${isReordering ? 'active' : ''}`}
          onClick={() => {
            if (isReordering && onReorderDone) {
              onReorderDone();
            }
            setIsReordering(!isReordering);
          }}
          title={isReordering ? 'Done reordering' : 'Reorder sections'}
        >
          {isReordering ? <Check size={16} /> : <GripVertical size={16} />}
        </button>
      </div>
      <nav 
        className="toc-nav" 
        aria-label="Document sections"
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            clearDragOverState();
          }
        }}
      >
        {sections.length === 0 ? (
          <div className="toc-empty-state">
            <p className="toc-empty-message">No sections yet</p>
            {!isReordering && (
              <button
                type="button"
                className="toc-add-section toc-add-section-inline"
                onClick={onAddTopLevel}
              >
                <Plus size={18} strokeWidth={2} />
                <span>Add section</span>
              </button>
            )}
          </div>
        ) : (
          sections.map((section) => renderSection(section))
        )}
      </nav>
      {sections.length > 0 && !isReordering && (
        <button type="button" className="toc-add-section" onClick={onAddTopLevel}>
          <Plus size={18} strokeWidth={2} />
          <span>Add section</span>
        </button>
      )}
    </aside>
  );
};

export default TocSidebar;
