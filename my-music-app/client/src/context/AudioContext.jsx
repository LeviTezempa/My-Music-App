import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { AudioContext } from './contextInstance';
import API_URL from '../api';
import { useAudioQueue } from './audio/useAudioQueue';
import { useYouTubePlayer } from './audio/useYouTubePlayer';

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTrackRef = useRef(null);
  const startTrackRef = useRef(() => {});

  const {
    isShuffling,
    toggleShuffle,
    isRepeating,
    toggleRepeat,
    playTrack,
    nextTrack,
    previousTrack,
    nextTrackRef,
  } = useAudioQueue(startTrackRef, currentTrackRef);
  const { player, playerRef, pendingYoutubeIdRef } = useYouTubePlayer(
    nextTrackRef,
    setIsPlaying,
  );

  const startTrack = async (track) => {
    try {
      currentTrackRef.current = track;
      setCurrentTrack(track);

      const response = await axios.get(`${API_URL}/music/resolve`, {
        params: {
          spotifyId: track.spotifyId,
          title: track.title,
          artist: track.artist,
        },
      });

      const { youtubeId } = response.data;
      if (!youtubeId) {
        throw new Error('No YouTube ID resolved for track');
      }

      const activePlayer = playerRef.current || player;
      if (activePlayer && typeof activePlayer.loadVideoById === 'function') {
        activePlayer.loadVideoById(youtubeId);
        setIsPlaying(true);
      } else {
        pendingYoutubeIdRef.current = youtubeId;
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error streaming track:', error?.response?.data || error.message);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    startTrackRef.current = startTrack;
  });

  const togglePlay = () => {
    const activePlayer = playerRef.current || player;
    if (!activePlayer) return;

    if (isPlaying) {
      if (typeof activePlayer.pauseVideo === 'function') {
        activePlayer.pauseVideo();
      }
      setIsPlaying(false);
    } else {
      if (typeof activePlayer.playVideo === 'function') {
        activePlayer.playVideo();
      }
      setIsPlaying(true);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        togglePlay,
        nextTrack,
        previousTrack,
        isShuffling,
        toggleShuffle,
        isRepeating,
        toggleRepeat,
      }}
    >
      {children}
      <div className="hidden-youtube-player">
        <div id="hidden-youtube-player"></div>
      </div>
    </AudioContext.Provider>
  );
};
