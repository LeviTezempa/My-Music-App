// Pulls trending music to the dashboard
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAudio } from '../hooks/useAudio';
import { Play, Pause, Loader2, AlertCircle } from 'lucide-react';

const FALLBACK_ARTWORK = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60';

export default function Discover() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryIndex, setRetryIndex] = useState(0);
  
  // Hooks must ONLY be called at the very top level of your component function
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  useEffect(() => {
    let ignore = false;

    const fetchTracks = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_URL}/music/new-releases`);
        
        if (!ignore) {
          if (Array.isArray(response.data)) {
            setTracks(response.data);
          } else {
            setTracks([]);
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load songs:', err);
          setError(err?.response?.data?.error || err.message || 'Failed to connect to music service');
          setTracks([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchTracks();

    return () => {
      ignore = true;
    };
  }, [retryIndex]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryIndex((prev) => prev + 1);
  };

  return (
    <div style={{ padding: '2rem', background: '#121212', minHeight: '100vh', color: '#fff', paddingBottom: '7rem' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem', fontWeight: 'bold' }}>Trending Hits</h1>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#b3b3b3', padding: '3rem 0', justifyContent: 'center' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Fetching trending music...</span>
        </div>
      )}

      {error && !loading && (
        <div style={{
          background: '#281515', border: '1px solid #5a1e1e', borderRadius: '8px', 
          padding: '1.5rem', maxWidth: '500px', margin: '2rem auto', textAlign: 'center'
        }}>
          <AlertCircle size={36} color="#ff5555" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ color: '#ff6b6b', marginBottom: '0.5rem' }}>Could Not Load Tracks</h3>
          <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
          <button 
            onClick={handleRetry}
            style={{
              background: '#1DB954', color: '#fff', border: 'none', padding: '0.5rem 1.25rem',
              borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {tracks.map((track, index) => {
            const isThisTrackPlaying = currentTrack?.spotifyId === track.spotifyId && isPlaying;
            const artworkSrc = (track.artwork && track.artwork !== 'https://placehold.co') 
              ? track.artwork 
              : FALLBACK_ARTWORK;
            
            return (
              <div 
                key={track.spotifyId || `${track.title}-${index}`} 
                style={{ 
                  background: '#181818', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#242424')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181818')}
              >
                <div>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1', marginBottom: '0.75rem', overflow: 'hidden', borderRadius: '4px' }}>
                    <img 
                      src={artworkSrc} 
                      alt={track.title} 
                      onError={(e) => { e.currentTarget.src = FALLBACK_ARTWORK; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.title}
                  </div>
                  <div style={{ color: '#b3b3b3', fontSize: '0.85rem', marginTop: '0.25rem', marginBottom: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.artist}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => currentTrack?.spotifyId === track.spotifyId ? togglePlay() : playTrack(track)}
                    aria-label={isThisTrackPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                    style={{
                      background: '#1DB954', border: 'none', borderRadius: '50%', width: '42px', height: '42px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.4)', transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {isThisTrackPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
