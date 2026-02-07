import React from 'react';

const ChatSidebar = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="editor-side-panel">
      <div className="docs-chat-panel">
        <div className="chat-header">
          <h3>BrainBox AI</h3>
        </div>
        <div className="chat-messages">
          <div className="message bot">
            How can I help you with your note today?
          </div>
        </div>
        <div className="chat-input-container">
          <input type="text" placeholder="Ask AI..." className="chat-input" />
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
