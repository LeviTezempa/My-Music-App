import { useAudio } from '../hooks/useAudio';

const formatTime = (time) => {
  const totalSeconds = Math.floor(Math.max(0, time));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export default function Playbar() {
  const { currentTime, duration, seekTo } = useAudio();
  const progress = duration > 0 ? Math.min(currentTime, duration) : 0;

  return (
    <div className="playbar">
      <span className="playbar-time" aria-label="Elapsed time">
        {formatTime(progress)}
      </span>
      <input
        className="playbar-seek"
        type="range"
        min="0"
        max={duration || 0}
        step="1"
        value={progress}
        disabled={duration <= 0}
        aria-label="Seek through track"
        aria-valuetext={`${formatTime(progress)} of ${formatTime(duration)}`}
        onChange={(event) => seekTo(Number(event.target.value))}
        style={{ '--playbar-progress': `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
      />
      <span className="playbar-time" aria-label="Track duration">
        {formatTime(duration)}
      </span>
    </div>
  );
}
