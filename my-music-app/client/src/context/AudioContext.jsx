import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AudioContext } from './contextInstance';
import API_URL from '../api';

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const playerRef = useRef(null);
  const pendingYoutubeIdRef = useRef(null);

  // Initialize YouTube Iframe API globally
  useEffect(() => {
    let isMounted = true;

    const initYTPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      try {
        const ytPlayer = new window.YT.Player('hidden-youtube-player', {
          height: '0',
          width: '0',
          playerVars: {
            autoplay: 1,
            playsinline: 1,
            controls: 0,
          },
          events: {
            onReady: (event) => {
              if (!isMounted) return;
              playerRef.current = event.target;
              setPlayer(event.target);

              // If a song was clicked while player was still loading
              if (pendingYoutubeIdRef.current) {
                event.target.loadVideoById(pendingYoutubeIdRef.current);
                pendingYoutubeIdRef.current = null;
              }
            },
            onStateChange: (event) => {
              if (!isMounted) return;
              // 0: Ended, 1: Playing, 2: Paused
              if (event.data === 0) {
                setIsPlaying(false);
              } else if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              }
            },
            onError: (err) => {
              console.error('YouTube player error:', err);
              if (isMounted) setIsPlaying(false);
            },
          },
        });

        playerRef.current = ytPlayer;
        setPlayer(ytPlayer);
      } catch (err) {
        console.error('Failed to instantiate YouTube player:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initYTPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        initYTPlayer();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const playTrack = async (track) => {
    try {
      setCurrentTrack(track);

      // Hit our backend resolve engine
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
        // Player not ready yet, save pending
        pendingYoutubeIdRef.current = youtubeId;
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error streaming track:', error?.response?.data || error.message);
      setIsPlaying(false);
    }
  };

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
    <AudioContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay }}>
      {children}
      {/* Invisible anchor element container injected into DOM for stream extraction */}
      <div className="hidden-youtube-player">
        <div id="hidden-youtube-player"></div>
      </div>
    </AudioContext.Provider>
  );
};
