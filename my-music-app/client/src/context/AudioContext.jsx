// Building a seamless playing interfac


import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
const [currentTrack, setCurrentTrack] = useState(null);
const [isPlaying, setIsPlaying] = useState(false);
const [player, setPlayer] = useState(null);


  // Initialize YouTube Iframe API globally
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://youtube.com';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        const ytPlayer = new window.YT.Player('hidden-youtube-player', {
          height: '0',
          width: '0',
          events: {
            onStateChange: (event) => {
              // 0 means ended -> auto stop or skip
              if (event.data === 0) setIsPlaying(false);
            },
          },
        });
        setPlayer(ytPlayer);
      };
    }
  }, []);

  const playTrack = async (track) => {
    try {
      setCurrentTrack(track);
      setIsPlaying(true);

      // Hit our backend resolve engine
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API_URL}/music/resolve`, {
        params: {
          spotifyId: track.spotifyId,
          title: track.title,
          artist: track.artist
        }
      });

      const { youtubeId } = response.data;
      //setYoutubeId(youtubeId);

      if (player && youtubeId) {
        player.loadVideoById(youtubeId);
        player.playVideo();
      }
    } catch (error) {
      console.error('Error streaming track:', error.message);
    }
  };

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay }}>
      {children}
      {/* Invisible anchor element injected into DOM for stream extraction */}
      <div id="hidden-youtube-player" style={{ position: 'absolute', top: '-1000px' }}></div>
    </AudioContext.Provider>
  );
};

