
import { useContext } from 'react';
import { AudioContext } from '../context/AudioContext';

export const useAudio = () => useContext(AudioContext);