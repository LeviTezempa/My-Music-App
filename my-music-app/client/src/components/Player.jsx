// The persistent Youtube iframe player bar
import { useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { Play, Pause, Music } from 'lucide-react'; // react built-in icon library

// Calls a default image url anytime a false image refuses to load.
const FALLBACK_ARTWORK = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=60';

export default function Player() {
  const { currentTrack, isPlaying, togglePlay } = useAudio();
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
      <div>
        <button
          className="player-toggle"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} color="#000" /> : <Play className="player-play-icon" size={20} color="#000" />}
        </button>
      </div>
      <div className="player-caption">
        <Music size={16} /> Streaming audio via YouTube
      </div>
    </div>
  );
}
