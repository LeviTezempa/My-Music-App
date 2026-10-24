import { useEffect, useRef, useState } from 'react';

export const useYouTubePlayer = (nextTrackRef, setIsPlaying) => {
  const [player, setPlayer] = useState(null);
  const playerRef = useRef(null);
  const pendingYoutubeIdRef = useRef(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

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
              if (!isMountedRef.current) return;
              playerRef.current = event.target;
              setPlayer(event.target);

              if (pendingYoutubeIdRef.current) {
                event.target.loadVideoById(pendingYoutubeIdRef.current);
                pendingYoutubeIdRef.current = null;
              }
            },
            onStateChange: (event) => {
              if (!isMountedRef.current) return;
              if (event.data === 0) {
                setIsPlaying(false);
                nextTrackRef.current?.();
              } else if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              }
            },
            onError: (error) => {
              console.error('YouTube player error:', error);
              if (isMountedRef.current) setIsPlaying(false);
            },
          },
        });

        playerRef.current = ytPlayer;
        setPlayer(ytPlayer);
      } catch (error) {
        console.error('Failed to instantiate YouTube player:', error);
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
  }, [nextTrackRef, setIsPlaying]);

  return { player, playerRef, pendingYoutubeIdRef };
};
