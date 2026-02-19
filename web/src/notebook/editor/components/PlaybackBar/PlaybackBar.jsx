import { SkipBack, Play, SkipForward, Volume2 } from 'lucide-react';

const PlaybackBar = () => {
  return (
    <div className="playback-bar">
      <div className="playback-bar-inner">
        <div className="playback-controls">
          <button type="button" className="playback-btn" aria-label="Previous section" title="Previous section">
            <SkipBack size={22} strokeWidth={2} />
          </button>
          <button type="button" className="playback-btn playback-btn-play" aria-label="Play" title="Play">
            <Play size={26} strokeWidth={2} fill="currentColor" />
          </button>
          <button type="button" className="playback-btn" aria-label="Next section" title="Next section">
            <SkipForward size={22} strokeWidth={2} />
          </button>
        </div>

        <div className="playback-progress-wrap">
          <span className="playback-time playback-time-current">0:00</span>
          <div className="playback-progress">
            <div className="playback-progress-track" />
            <div className="playback-progress-fill" style={{ width: '0%' }} />
          </div>
          <span className="playback-time playback-time-total">0:00</span>
        </div>

        <div className="playback-right">
          <select className="playback-speed" defaultValue="1" aria-label="Playback speed">
            <option value="0.75">0.75×</option>
            <option value="1">1×</option>
            <option value="1.25">1.25×</option>
            <option value="1.5">1.5×</option>
          </select>
          <button type="button" className="playback-btn playback-btn-volume" aria-label="Volume" title="Volume">
            <Volume2 size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaybackBar;
