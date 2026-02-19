import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import EditableTitle from '../../../../common/components/EditableTitle';

const EditorNavbar = ({ notebookTitle, viewMode, onViewModeChange, onTitleChange }) => {
  return (
    <header className="editor-navbar">
      <div className="editor-navbar-left">
        <Link to="/dashboard" className="editor-navbar-back" aria-label="Back to Dashboard">
          <ArrowLeft size={20} strokeWidth={1.75} />
          <span>Back</span>
        </Link>
        <div className="editor-navbar-divider" />
        <div className="editor-navbar-title">
          <BookOpen size={20} strokeWidth={1.75} />
          <EditableTitle
            tag="span"
            initialTitle={notebookTitle}
            onSave={onTitleChange}
            className="editor-navbar-title-text"
          />
        </div>
      </div>

      <div className="editor-navbar-center">
        <div className="editor-view-toggle" role="tablist" aria-label="View mode">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'section'}
            className={`editor-view-toggle-btn ${viewMode === 'section' ? 'active' : ''}`}
            onClick={() => onViewModeChange('section')}
          >
            Section view
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'long'}
            className={`editor-view-toggle-btn ${viewMode === 'long' ? 'active' : ''}`}
            onClick={() => onViewModeChange('long')}
          >
            Long document
          </button>
        </div>
      </div>

      <div className="editor-navbar-right">
        <span className="editor-navbar-hint">
          {viewMode === 'section' ? 'One section at a time' : 'Full document scroll'}
        </span>
      </div>
    </header>
  );
};

export default EditorNavbar;
