import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../api';

export const usePlaylistData = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInitialPlaylists = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/playlists`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching library playlists:', error);
      }
    };

    fetchInitialPlaylists();
  }, [token]);

  const handleCreatePlaylist = async (event) => {
    event.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      const response = await axios.post(
        `${API_URL}/playlists`,
        { name: newPlaylistName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNewPlaylistName('');
      setPlaylists((previousPlaylists) => [...previousPlaylists, response.data]);
    } catch (error) {
      console.error('Error creating playlist container:', error);
    }
  };

  const handleOpenPlaylist = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/playlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPlaylist(response.data);
    } catch (error) {
      console.error('Error opening selected playlist:', error);
    }
  };

  const handleDeleteTrack = async (trackId) => {
    if (!selectedPlaylist) return;
    try {
      const response = await axios.delete(
        `${API_URL}/playlists/${selectedPlaylist._id}/tracks/${trackId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSelectedPlaylist(response.data);
      setPlaylists((previousPlaylists) =>
        previousPlaylists.map((playlist) =>
          playlist._id === selectedPlaylist._id
            ? { ...playlist, tracks: response.data.tracks }
            : playlist,
        ),
      );
    } catch (error) {
      console.error('Error removing track from backend:', error);
    }
  };

  return {
    playlists,
    newPlaylistName,
    setNewPlaylistName,
    selectedPlaylist,
    handleCreatePlaylist,
    handleOpenPlaylist,
    handleDeleteTrack,
  };
};
