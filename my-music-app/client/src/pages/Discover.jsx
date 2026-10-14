// Pulls trending music to the dashboard

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAudio } from '../hooks/useAudio';
import { Play, Pause } from 'lucide-react';

export default function Discover() {
  const [tracks, setTracks] = useState([]);
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/music/new-releases`);
        setTracks(response.data);
      } catch (error) {
        console.error('Failed to load songs:', error);
      }
    };
    fetchTracks();
  }, []);

  return (
    <div style={{ padding: '2rem', background: '#121212', minHeight: '100vh', color: '#fff', paddingBottom: '6rem' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Trending Hits</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {tracks.map((track) => {
          const isThisTrackPlaying = currentTrack?.spotifyId === track.spotifyId && isPlaying;
          
          return (
            <div key={track.spotifyId} style={{ background: '#181818', padding: '1rem', borderRadius: '8px', position: 'relative' }}>
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
    </div>
  );
}
