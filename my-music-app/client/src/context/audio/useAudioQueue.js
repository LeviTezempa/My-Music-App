import { useEffect, useRef, useState } from 'react';

export const useAudioQueue = (startTrackRef, currentTrackRef) => {
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const nextTrackRef = useRef(() => {});
  const queueRef = useRef([]);
  const currentIndexRef = useRef(-1);
  const historyRef = useRef([]);
  const isShufflingRef = useRef(false);
  const isRepeatingRef = useRef(false);

  const playTrack = (track, tracks = [track]) => {
    const trackQueue = tracks.length ? tracks : [track];
    const trackIndex = trackQueue.indexOf(track);
    queueRef.current = trackQueue;
    currentIndexRef.current = trackIndex === -1 ? 0 : trackIndex;
    historyRef.current = [];
    startTrackRef.current(track);
  };

  const nextTrack = () => {
    const currentQueue = queueRef.current;
    const currentIndex = currentIndexRef.current;
    if (currentQueue.length < 2) {
      if (isRepeatingRef.current && currentTrackRef.current) {
        startTrackRef.current(currentTrackRef.current);
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
    startTrackRef.current(currentQueue[nextIndex]);
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
    startTrackRef.current(currentQueue[previousIndex]);
  };

  useEffect(() => {
    nextTrackRef.current = nextTrack;
  });

  const toggleShuffle = () => {
    isShufflingRef.current = !isShufflingRef.current;
    setIsShuffling(isShufflingRef.current);
  };

  const toggleRepeat = () => {
    isRepeatingRef.current = !isRepeatingRef.current;
    setIsRepeating(isRepeatingRef.current);
  };

  return {
    isShuffling,
    toggleShuffle,
    isRepeating,
    toggleRepeat,
    playTrack,
    nextTrack,
    previousTrack,
    nextTrackRef,
  };
};
