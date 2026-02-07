import React from 'react';

const StatsBar = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="docs-stats-panel">
      <span>
        <strong>Words:</strong> {stats.words}
      </span>
      <span>
        <strong>Characters:</strong> {stats.characters}
      </span>
      <span>
        <strong>Reading time:</strong> {stats.readingMinutes} min
      </span>
    </div>
  );
};

export default StatsBar;

