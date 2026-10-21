// Global audio state (current playing song)
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AudioContext } from './contextInstance';
import API_URL from '../api';

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const playerRef = useRef(null);
  const pendingYoutubeIdRef = useRef(null);
  const nextTrackRef = useRef(() => {});
  const queueRef = useRef([]);
  const currentIndexRef = useRef(-1);
  const historyRef = useRef([]);
  const currentTrackRef = useRef(null);
  const isShufflingRef = useRef(false);
  const isRepeatingRef = useRef(false);
  const isMountedRef = useRef(false);

  // Initialize YouTube Iframe API globally
  useEffect(() => {
    isMountedRef.current = true;

    const initYTPlayer = () => {
      if (!window.YT || !window.YT.Player) return; // Prevents my app from crashing or creating duplicate player
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
              if (!isMountedRef.current) return;
              playerRef.current = event.target;
              setPlayer(event.target);

              // If a song was clicked while player was still loading
              if (pendingYoutubeIdRef.current) {
                event.target.loadVideoById(pendingYoutubeIdRef.current);
                pendingYoutubeIdRef.current = null;
              }
            },
            onStateChange: (event) => {
              if (!isMountedRef.current) return;
              // 0: Ended, 1: Playing, 2: Paused
              if (event.data === 0) {
                setIsPlaying(false);
                nextTrackRef.current?.();
              } else if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              }
            },
            onError: (err) => {
              console.error('YouTube player error:', err);
              if (isMountedRef.current) setIsPlaying(false);
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
      isMountedRef.current = false;
    };
  }, []);

  const startTrack = async (track) => {
    try {
      currentTrackRef.current = track;
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

  const playTrack = (track, tracks = [track]) => {
    const trackQueue = tracks.length ? tracks : [track];
    const trackIndex = trackQueue.indexOf(track);
    queueRef.current = trackQueue;
    currentIndexRef.current = trackIndex === -1 ? 0 : trackIndex;
    historyRef.current = [];
    startTrack(track);
  };

  const nextTrack = () => {
    const currentQueue = queueRef.current;
    const currentIndex = currentIndexRef.current;
    if (currentQueue.length < 2) {
      if (isRepeatingRef.current && currentTrackRef.current) {
        startTrack(currentTrackRef.current);
      }
      return;
    }

    let nextIndex;
    if (isShufflingRef.current) {
      nextIndex = Math.floor(Math.random() * (currentQueue.length - 1));
      if (nextIndex >= currentIndex) nextIndex += 1;
    } else if (currentIndex < currentQueue.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (isRepeatingRef.current) {
      nextIndex = 0;
    } else {
      return;
    }

    historyRef.current = [...historyRef.current, currentIndex];
    currentIndexRef.current = nextIndex;
    startTrack(currentQueue[nextIndex]);
  };

  const previousTrack = () => {
    const currentQueue = queueRef.current;
    const currentIndex = currentIndexRef.current;
    if (currentQueue.length < 2) return;

    let previousIndex;
    if (historyRef.current.length) {
      previousIndex = historyRef.current[historyRef.current.length - 1];
      historyRef.current = historyRef.current.slice(0, -1);
    } else if (currentIndex > 0) {
      previousIndex = currentIndex - 1;
    } else if (isRepeatingRef.current) {
      previousIndex = currentQueue.length - 1;
    } else {
      return;
    }
    currentIndexRef.current = previousIndex;
    startTrack(currentQueue[previousIndex]);
  };

  useEffect(() => {
    nextTrackRef.current = nextTrack;
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
        toggleShuffle: () => {
          isShufflingRef.current = !isShufflingRef.current;
          setIsShuffling(isShufflingRef.current);
        },
        isRepeating,
        toggleRepeat: () => {
          isRepeatingRef.current = !isRepeatingRef.current;
          setIsRepeating(isRepeatingRef.current);
        },
      }}
    >
      {children}
      {/* Invisible anchor element container injected into DOM for stream extraction */}
      <div className="hidden-youtube-player">
        <div id="hidden-youtube-player"></div>
      </div>
    </AudioContext.Provider>
  );
};
