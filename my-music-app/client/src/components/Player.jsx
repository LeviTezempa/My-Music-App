// The persistent Youtube iframe player bar
import { useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { Play, Pause, Music, Shuffle, SkipBack, SkipForward, Repeat } from 'lucide-react';
import Playbar from './Playbar';

// Calls a default image url anytime a false image refuses to load.
const FALLBACK_ARTWORK = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=60';

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    previousTrack,
    isShuffling,
    toggleShuffle,
    isRepeating,
    toggleRepeat,
  } = useAudio();
  const [imgSrc, setImgSrc] = useState(null);

  if (!currentTrack) return null;

  const artworkUrl = imgSrc || currentTrack.artwork || FALLBACK_ARTWORK;

  return (
    <div className="player-bar">
      <div className="player-track">
        <img
          className="player-artwork"
          src={artworkUrl}
          alt={currentTrack.title || 'Track artwork'}
          onError={() => setImgSrc(FALLBACK_ARTWORK)}
        />
        <div className="player-track-info">
          <div className="player-title">{currentTrack.title}</div>
          <div className="player-artist">{currentTrack.artist}</div>
        </div>
      </div>
      <div className="player-main">
        <Playbar />
        <div className="player-controls">
          <button
            type="button"
            className={`player-control-button${isShuffling ? ' is-active' : ''}`}
            onClick={toggleShuffle}
            aria-label={isShuffling ? 'Disable shuffle' : 'Enable shuffle'}
            aria-pressed={isShuffling}
          >
            <Shuffle size={20} />
          </button>
          <button
            type="button"
            className="player-control-button"
            onClick={previousTrack}
            aria-label="Previous track"
          >
            <SkipBack size={22} />
          </button>
          <button
            type="button"
            className="player-toggle"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="player-toggle-inner">
              {isPlaying ? <Pause size={25} color="#000" /> : <Play className="player-play-icon" size={25} color="#000" />}
            </span>
          </button>
          <button
            type="button"
            className="player-control-button"
            onClick={nextTrack}
            aria-label="Next track"
          >
            <SkipForward size={22} />
          </button>
          <button
            type="button"
            className={`player-control-button${isRepeating ? ' is-active' : ''}`}
            onClick={toggleRepeat}
            aria-label={isRepeating ? 'Disable repeat' : 'Enable repeat'}
            aria-pressed={isRepeating}
          >
            <Repeat size={20} />
          </button>
        </div>
      </div>
      <div className="player-caption">
        <Music size={16} /> Streaming audio via YouTube
      </div>
    </div>
  );
}
