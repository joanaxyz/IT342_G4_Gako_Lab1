import React from 'react';
import { BarChart2, Focus, Search, Bot } from 'lucide-react';

const EditorActions = ({ 
  onToggleStats, 
  showStats, 
  onToggleFocus, 
  isFocusMode, 
  onToggleSearch, 
  onToggleChat 
}) => {
  return (
    <div className="right-sidebar-group">
      <div
        className="right-icon"
        onClick={onToggleStats}
        title={showStats ? 'Hide word counter' : 'Show word counter'}
      >
        <BarChart2 size={24} />
      </div>
      <div
        className="right-icon"
        onClick={onToggleFocus}
        title={isFocusMode ? 'Exit focus mode' : 'Enter focus mode'}
      >
        <Focus size={24} />
      </div>
      <div
        className="right-icon"
        onClick={onToggleSearch}
        title="Search / replace (Ctrl+F)"
      >
        <Search size={24} />
      </div>
      <div
        className="right-icon"
        onClick={onToggleChat}
        title="BrainBox AI Chat"
      >
        <Bot size={24} />
      </div>
    </div>
  );
};

export default EditorActions;
