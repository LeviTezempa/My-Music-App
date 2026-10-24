import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../api';

export const useDiscoverData = () => {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);
  const [tracksError, setTracksError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    let isCurrentRequest = true;
    const query = searchQuery.trim();

    const timeoutId = setTimeout(async () => {
      try {
        const endpoint = query ? '/music/search' : '/music/new-releases';
        const response = await axios.get(`${API_URL}${endpoint}`, {
          params: query ? { q: query } : undefined,
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
          headers: { Authorization: `Bearer ${token}` },
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
        artwork: track.artwork,
      }, {
        headers: { Authorization: `Bearer ${token}` },
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

  return {
    tracks,
    playlists,
    searchQuery,
    isLoadingTracks,
    tracksError,
    activeDropdown,
    setActiveDropdown,
    handleAddToPlaylist,
    clearSearch,
    handleSearchChange,
  };
};
