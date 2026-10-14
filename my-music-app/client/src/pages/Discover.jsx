// importing our needed modules
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAudio } from '../hooks/useAudio';
import { Play, Pause, Search } from 'lucide-react';

export default function Discover() {
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Tracking search text strings
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_URL}/music/new-releases`);
        
        if (Array.isArray(response.data)) {
          setTracks(response.data);
        } else {
          setTracks([]);
        }
      } catch (error) {
        console.error('Failed to load songs:', error);
        setTracks([]);
      }
    };
    fetchTracks();
  }, []);

  // FILTER ENGINE: Dynamically reduces grid cards based on search matching
  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', background: '#121212', minHeight: '100vh', color: '#fff', paddingBottom: '6rem' }}>
      
      {/* Search Bar UI Input */}
      <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '2.5rem' }}>
        <Search size={20} style={{ position: 'absolute', top: '12px', left: '14px', color: '#b3b3b3' }} />
        <input 
          type="text" 
          placeholder="What do you want to listen to?" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: '#242424',
             borderRadius: '25px', color: '#fff', fontSize: '1rem',
            outline: 'none', border: '1px solid transparent'
          }} 
          onFocus={(e) => e.target.style.border = '1px solid #1DB954'}
          onBlur={(e) => e.target.style.border = '1px solid transparent'}
        />
      </div>

      <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Trending Hits</h1>
      
      {filteredTracks.length === 0 ? (
        <div style={{ color: '#b3b3b3', marginTop: '2rem' }}>No matching songs found for "{searchQuery}"</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {filteredTracks.map((track) => {
            const isThisTrackPlaying = currentTrack?.spotifyId === track.spotifyId && isPlaying;
            
            return (
              <div key={track.spotifyId} style={{ background: '#181818', padding: '1rem', borderRadius: '8px' }}>
                <img src={track.artwork} alt={track.title} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.75rem' }} />
                <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
                <div style={{ color: '#b3b3b3', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '1rem' }}>{track.artist}</div>
                
                <button 
                  onClick={() => currentTrack?.spotifyId === track.spotifyId ? togglePlay() : playTrack(track)}
                  style={{
                    background: '#1DB954', border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff'
                  }}
                >
                  {isThisTrackPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
