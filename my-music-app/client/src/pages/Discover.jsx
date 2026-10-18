import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAudio } from '../hooks/useAudio';
import { Play, Pause, Search, Plus, FolderHeart } from 'lucide-react';

export default function Discover() {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]); // Array to store user's folder configurations
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null); // Track which song playlist menu is open
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch trending music catalog feed
        const musicResponse = await axios.get(`${API_URL}/music/new-releases`);
        if (Array.isArray(musicResponse.data)) {
          setTracks(musicResponse.data);
        } else {
          setTracks([]);
        }

        // 2. Fetch user playlists from database using verification token
        if (token) {
          const playlistsResponse = await axios.get(`${API_URL}/playlists`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (Array.isArray(playlistsResponse.data)) {
            setPlaylists(playlistsResponse.data);
          }
        }
      } catch (error) {
        console.error('Failed to load initial workspace data:', error);
        setTracks([]);
      }
    };
    fetchData();
  }, [API_URL, token]);

  // Handle adding a song to a specific playlist inside MongoDB
  const handleAddToPlaylist = async (playlistId, track) => {
    try {
      await axios.post(`${API_URL}/playlists/${playlistId}/tracks`, {
        spotifyId: track.spotifyId,
        title: track.title,
        artist: track.artist,
        artwork: track.artwork
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Track added to playlist safely!');
      setActiveDropdown(null); // Close window menu anchor framework layout
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add track.');
    }
  };

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
                <img
                  className="track-artwork"
                  src={track.artwork || '/music-artwork-placeholder.svg'}
                  alt={track.title}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = '/music-artwork-placeholder.svg';
                  }}
                />
                <div className="track-title">{track.title}</div>
                <div className="track-artist">{track.artist}</div>

                <div className="track-card-controls">
                  {/* Play Button */}
                  <button
                    className="track-play-button"
                    onClick={() => currentTrack?.spotifyId === track.spotifyId ? togglePlay() : playTrack(track)}
                    aria-label={`${isThisTrackPlaying ? 'Pause' : 'Play'} ${track.title}`}
                  >
                    {isThisTrackPlaying
                      ? <Pause size={18} />
                      : <Play className="player-play-icon" size={18} />}
                  </button>

                  {/* Add To Playlist Trigger Button */}
                  <button
                    className="track-add-button"
                    onClick={() => setActiveDropdown(activeDropdown === track.spotifyId ? null : track.spotifyId)}
                    aria-label="Add to playlist options"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Dynamic Dropdown Overlay Menu */}
                {activeDropdown === track.spotifyId && (
                  <div className="playlist-dropdown-menu">
                    <div className="playlist-dropdown-heading">Add to Playlist</div>
                    {playlists.length === 0 ? (
                      <div className="playlist-dropdown-empty">No playlists found</div>
                    ) : (
                      playlists.map(pl => (
                        <button
                          className="playlist-dropdown-item"
                          key={pl._id}
                          onClick={() => handleAddToPlaylist(pl._id, track)}
                        >
                          <FolderHeart size={14} color="#1DB954"/> {pl.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
