// Fetches & show Apple music latest drops
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Play, Pause, Search, Plus, FolderHeart, X } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import API_URL from '../api';

export default function Discover() {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);
  const [tracksError, setTracksError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const token = localStorage.getItem('token');

  useEffect(() => {
    let isCurrentRequest = true;
    const query = searchQuery.trim();

    const timeoutId = setTimeout(async () => {
      try {
        const endpoint = query ? '/music/search' : '/music/new-releases';
        const response = await axios.get(`${API_URL}${endpoint}`, {
          params: query ? { q: query } : undefined
        });

        if (isCurrentRequest) {
          setTracksError('');
          setTracks(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        if (isCurrentRequest) {
          console.error('Failed to load music search results:', error);
          setTracksError(error.response?.data?.error || 'Unable to load songs right now.');
          setTracks([]);
        }
      } finally {
        if (isCurrentRequest) setIsLoadingTracks(false);
      }
    }, query ? 300 : 0);

    return () => {
      isCurrentRequest = false;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  useEffect(() => {
    let isCurrentRequest = true;

    const fetchPlaylists = async () => {
      if (!token) {
        setPlaylists([]);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/playlists`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (isCurrentRequest && Array.isArray(response.data)) {
          setPlaylists(response.data);
        }
      } catch (error) {
        console.error('Failed to load playlists:', error);
      }
    };

    fetchPlaylists();
    return () => {
      isCurrentRequest = false;
    };
  }, [token]);

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
      setActiveDropdown(null);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add track.');
    }
  };

  const clearSearch = () => {
    setIsLoadingTracks(true);
    setSearchQuery('');
    setActiveDropdown(null);
  };

  const handleSearchChange = (event) => {
    setIsLoadingTracks(true);
    setSearchQuery(event.target.value);
  };

  return (
    <main className="discover-page">
      <form className="search-wrap" role="search" onSubmit={(event) => event.preventDefault()}>
        <Search className="search-icon" size={20} aria-hidden="true" />
        <input
          className="search-input"
          type="search"
          placeholder="Search songs or artists"
          aria-label="Search songs or artists"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <button
            className="search-clear-button"
            type="button"
            aria-label="Clear search"
            onClick={clearSearch}
          >
            <X size={18} />
          </button>
        )}
      </form>

      <h1 className="discover-heading">
        {searchQuery.trim() ? 'Search Results' : 'Trending Hits'}
      </h1>

      {isLoadingTracks ? (
        <div className="empty-results" role="status">Searching music...</div>
      ) : tracksError ? (
        <div className="empty-results" role="alert">{tracksError}</div>
      ) : tracks.length === 0 ? (
        <div className="empty-results">
          {searchQuery.trim()
            ? `No songs or artists found for "${searchQuery.trim()}".`
            : 'No trending songs are available right now.'}
        </div>
      ) : (
        <div className="track-grid">
          {tracks.map((track) => {
            const isThisTrackPlaying = currentTrack?.spotifyId === track.spotifyId && isPlaying;

            return (
              <article className="track-card" key={track.spotifyId}>
                <img
                  className="track-artwork"
                  src={track.artwork || '/music-artwork-placeholder.svg'}
                  alt={`${track.title} artwork`}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = '/music-artwork-placeholder.svg';
                  }}
                />
                <div className="track-title">{track.title}</div>
                <div className="track-artist">{track.artist}</div>

                <div className="track-card-controls">
                  <button
                    className="track-play-button"
                    onClick={() => currentTrack?.spotifyId === track.spotifyId ? togglePlay() : playTrack(track)}
                    aria-label={`${isThisTrackPlaying ? 'Pause' : 'Play'} ${track.title}`}
                  >
                    {isThisTrackPlaying
                      ? <Pause size={18} />
                      : <Play className="player-play-icon" size={18} />}
                  </button>

                  <button
                    className="track-add-button"
                    onClick={() => setActiveDropdown(activeDropdown === track.spotifyId ? null : track.spotifyId)}
                    aria-label="Add to playlist options"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {activeDropdown === track.spotifyId && (
                  <div className="playlist-dropdown-menu">
                    <div className="playlist-dropdown-heading">Add to Playlist</div>
                    {playlists.length === 0 ? (
                      <div className="playlist-dropdown-empty">No playlists found</div>
                    ) : (
                      playlists.map((playlist) => (
                        <button
                          className="playlist-dropdown-item"
                          key={playlist._id}
                          onClick={() => handleAddToPlaylist(playlist._id, track)}
                        >
                          <FolderHeart size={14} color="var(--accent-purple)" /> {playlist.name}
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
