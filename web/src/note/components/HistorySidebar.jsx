import React from 'react';

const HistorySidebar = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="editor-side-panel">
      <div className="docs-history-panel">
        <div className="history-header">
          <h3>Version History</h3>
        </div>
        <div className="history-list">
          <div className="history-item active">
            <div className="history-date">Current version</div>
            <div className="history-user">You</div>
          </div>
          <div className="history-item">
            <div className="history-date">Yesterday, 4:30 PM</div>
            <div className="history-user">You</div>
          </div>
          <div className="history-item">
            <div className="history-date">Feb 5, 10:15 AM</div>
            <div className="history-user">You</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySidebar;
