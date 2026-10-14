import { useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { Play, Pause, Music } from 'lucide-react';

const FALLBACK_ARTWORK = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=60';

export default function Player() {
  const { currentTrack, isPlaying, togglePlay } = useAudio();
  const [imgSrc, setImgSrc] = useState(null);

  if (!currentTrack) return null;

  const artworkUrl = imgSrc || currentTrack.artwork || FALLBACK_ARTWORK;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, background: '#181818',
      padding: '0.85rem 2rem', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', borderTop: '1px solid #282828', color: '#fff', zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
        <img 
          src={artworkUrl} 
          alt={currentTrack.title || 'Track artwork'} 
          onError={() => setImgSrc(FALLBACK_ARTWORK)}
          style={{ width: '52px', height: '52px', borderRadius: '4px', objectFit: 'cover' }} 
        />
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#fff' }}>{currentTrack.title}</div>
          <div style={{ color: '#b3b3b3', fontSize: '0.8rem' }}>{currentTrack.artist}</div>
        </div>
      </div>
      <div>
        <button 
          onClick={togglePlay} 
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{
            background: '#fff', border: 'none', width: '42px', height: '42px',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            cursor: 'pointer', transition: 'transform 0.1s ease'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isPlaying ? <Pause size={20} color="#000" /> : <Play size={20} color="#000" style={{ marginLeft: '2px' }} />}
        </button>
      </div>
      <div style={{ color: '#b3b3b3', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Music size={16} /> Streaming audio via YouTube
      </div>
    </div>
  );
}
