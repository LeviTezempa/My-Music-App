// client/src/pages/Playlists.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAudio } from '../hooks/useAudio';
import { FolderHeart, Plus, Play, Trash2, Library } from 'lucide-react';

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const { playTrack } = useAudio();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // Self-contained data initialization hook clears all linter dependency flags
  useEffect(() => {
    const fetchInitialPlaylists = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/playlists`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlaylists(res.data);
      } catch (err) {
        console.error('Error fetching library playlists:', err);
      }
    };

    fetchInitialPlaylists();
  }, [token, API_URL]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/playlists`, 
        { name: newPlaylistName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPlaylistName('');
      
      // Instantly inject new playlist into state array to avoid dependency fetches
      setPlaylists((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Error creating playlist container:', err);
    }
  };

  const handleOpenPlaylist = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/playlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedPlaylist(res.data);
    } catch (err) {
      console.error('Error opening selected playlist:', err);
    }
  };

  const handleDeleteTrack = async (trackId) => {
    if (!selectedPlaylist) return;
    try {
      const res = await axios.delete(`${API_URL}/playlists/${selectedPlaylist._id}/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update selected playlist tracks listing panel
      setSelectedPlaylist(res.data);
      
      // Synchronize track counters on left-hand sidebar drawer panel rows
      setPlaylists((prev) => 
        prev.map((pl) => pl._id === selectedPlaylist._id ? { ...pl, tracks: res.data.tracks } : pl)
      );
    } catch (err) {
      console.error('Error removing track from backend:', err);
    }
  };

  return (
    <main className="playlists-page">
      <aside className="playlist-sidebar">
        <h2 className="playlist-library-heading">
          <Library size={22} color="#1DB954" /> Your Library
        </h2>
        
        <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
          <input
            type="text"
            placeholder="New Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="playlist-input"
          />
          <button type="submit" className="playlist-submit-btn" aria-label="Create playlist">
            <Plus size={20} />
          </button>
        </form>

        <div className="playlist-sidebar-list">
          {playlists.map(pl => (
            <button
              type="button"
              key={pl._id}
              onClick={() => handleOpenPlaylist(pl._id)}
              className={`playlist-sidebar-item ${selectedPlaylist?._id === pl._id ? 'active' : ''}`}
            >
              <FolderHeart color="#1DB954" size={20} />
              <div className="playlist-sidebar-item-info">
                <div className="playlist-sidebar-item-name">{pl.name}</div>
                <div className="playlist-sidebar-item-count">Tracks: {pl.tracks?.length || 0}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="playlist-content-view">
        {selectedPlaylist && selectedPlaylist._id ? (
          <div className="active-playlist-wrapper">
            <h1 className="active-playlist-heading">
              <FolderHeart size={36} color="#1DB954" /> {selectedPlaylist.name}
            </h1>
            
            {selectedPlaylist.tracks && selectedPlaylist.tracks.length === 0 ? (
              <div className="empty-playlist-msg">
                This playlist is currently empty. Go over to <strong>Discover</strong> to find some tracks!
              </div>
            ) : (
              <div className="playlist-track-rows-container">
                {selectedPlaylist.tracks.map((track, idx) => (
                  <div key={track._id} className="playlist-track-row">
                    <div className="playlist-track-details">
                      <span className="playlist-track-index">{idx + 1}</span>
                      <img
                        className="playlist-track-artwork"
                        src={track.artwork || '/music-artwork-placeholder.svg'}
                        alt={`${track.title} artwork`}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = '/music-artwork-placeholder.svg';
                        }}
                      />
                      <div className="playlist-track-info">
                        <div className="playlist-track-title">{track.title}</div>
                        <div className="playlist-track-artist">{track.artist}</div>
                      </div>
                    </div>
                    
                    <div className="playlist-track-actions">
                      <button
                        type="button"
                        aria-label={`Play ${track.title}`}
                        onClick={() => playTrack(track)}
                        className="playlist-row-play-btn"
                      >
                        <Play className="player-play-icon" size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${track.title}`}
                        onClick={() => handleDeleteTrack(track._id)}
                        className="playlist-row-delete-btn"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="playlist-empty-selection">
            <FolderHeart size={48} color="#282828" />
            <span>Select a playlist from the library side panel to view your saved songs.</span>
          </div>
        )}
      </section>
    </main>
  );
}
