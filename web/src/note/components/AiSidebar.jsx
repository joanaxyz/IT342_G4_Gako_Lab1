import { Sparkles, X } from 'lucide-react';

const AiSidebar = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="ai-sidebar-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="ai-sidebar" role="dialog" aria-label="AI assistant">
        <div className="ai-sidebar-header">
          <div className="ai-sidebar-title">
            <Sparkles size={20} strokeWidth={1.75} />
            <span>AI Assistant</span>
          </div>
          <button
            type="button"
            className="ai-sidebar-close"
            onClick={onClose}
            aria-label="Close AI sidebar"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <div className="ai-sidebar-content">
          <p className="ai-sidebar-hint">Ask about the current section or get help with learning.</p>
          <div className="ai-sidebar-actions">
            <button type="button" className="ai-sidebar-action">Summarize this section</button>
            <button type="button" className="ai-sidebar-action">Explain in simpler terms</button>
            <button type="button" className="ai-sidebar-action">Quiz me on this</button>
            <button type="button" className="ai-sidebar-action">Generate practice questions</button>
          </div>
          <div className="ai-sidebar-chat">
            <div className="ai-sidebar-chat-placeholder">
              Or type a question below…
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AiSidebar;
