import React from 'react';
import { X } from 'lucide-react';
import DocumentTools from './DocumentTools';
import EditorActions from './EditorActions';

const SidebarRight = ({
  onSave,
  onClose,
  onExportPdf,
  onExportDocx,
  onToggleStats,
  showStats,
  onToggleFocus,
  isFocusMode,
  onToggleSearch,
  onToggleChat,
}) => {
  return (
    <aside className="docs-right-sidebar">
      <div className="right-sidebar-icons">
        <DocumentTools 
          onSave={onSave} 
          onExportPdf={onExportPdf} 
          onExportDocx={onExportDocx} 
        />
        
        <hr className="sidebar-divider" />
        
        <EditorActions 
          onToggleStats={onToggleStats}
          showStats={showStats}
          onToggleFocus={onToggleFocus}
          isFocusMode={isFocusMode}
          onToggleSearch={onToggleSearch}
          onToggleChat={onToggleChat}
        />
        
        <hr className="sidebar-divider" />
        
        <div className="right-icon" onClick={onClose} title="Close editor">
          <X size={24} />
        </div>
      </div>
    </aside>
  );
};

export default SidebarRight;
