import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAudio } from '../hooks/useAudio';
import { Play, Pause, Search } from 'lucide-react';

export default function Discover() {
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
    <main className="discover-page">
      <div className="search-wrap">
        <Search className="search-icon" size={20} />
        <input
          className="search-input"
          type="text"
          placeholder="What do you want to listen to?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h1 className="discover-heading">Trending Hits</h1>

      {filteredTracks.length === 0 ? (
        <div className="empty-results">No matching songs found for "{searchQuery}"</div>
      ) : (
        <div className="track-grid">
          {filteredTracks.map((track) => {
            const isThisTrackPlaying = currentTrack?.spotifyId === track.spotifyId && isPlaying;

            return (
              <article className="track-card" key={track.spotifyId}>
                <img className="track-artwork" src={track.artwork} alt={track.title} />
                <div className="track-title">{track.title}</div>
                <div className="track-artist">{track.artist}</div>

                <button
                  className="track-play-button"
                  onClick={() => currentTrack?.spotifyId === track.spotifyId ? togglePlay() : playTrack(track)}
                  aria-label={`${isThisTrackPlaying ? 'Pause' : 'Play'} ${track.title}`}
                >
                  {isThisTrackPlaying
                    ? <Pause size={18} />
                    : <Play className="player-play-icon" size={18} />}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
