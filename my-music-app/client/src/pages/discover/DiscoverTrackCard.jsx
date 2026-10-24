import { FolderHeart, Pause, Play, Plus } from 'lucide-react';

export default function DiscoverTrackCard({
  track,
  tracks,
  playlists,
  currentTrack,
  isPlaying,
  activeDropdown,
  onPlayTrack,
  onTogglePlay,
  onToggleDropdown,
  onAddToPlaylist,
}) {
  const isCurrentTrack = currentTrack?.spotifyId === track.spotifyId;
  const isThisTrackPlaying = isCurrentTrack && isPlaying;

  return (
    <article className="track-card">
      <img
        className="track-artwork"
        src={track.artwork || '/music-artwork-placeholder.svg'}
        alt={`${track.title} artwork`}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = '/music-artwork-placeholder.svg';
        }}
      />
      <div className="track-title">{track.title}</div>
      <div className="track-artist">{track.artist}</div>

      <div className="track-card-controls">
        <button
          className="track-play-button"
          onClick={() => isCurrentTrack ? onTogglePlay() : onPlayTrack(track, tracks)}
          aria-label={`${isThisTrackPlaying ? 'Pause' : 'Play'} ${track.title}`}
        >
          {isThisTrackPlaying
            ? <Pause size={18} />
            : <Play className="player-play-icon" size={18} />}
        </button>

        <button
          className="track-add-button"
          onClick={() => onToggleDropdown(activeDropdown === track.spotifyId ? null : track.spotifyId)}
          aria-label="Add to playlist options"
        >
          <Plus size={18} />
        </button>
      </div>

      {activeDropdown === track.spotifyId && (
        <div className="playlist-dropdown-menu">
          <div className="playlist-dropdown-heading">Add to Playlist</div>
          {playlists.length === 0 ? (
            <div className="playlist-dropdown-empty">No playlists found</div>
          ) : (
            playlists.map((playlist) => (
              <button
                className="playlist-dropdown-item"
                key={playlist._id}
                onClick={() => onAddToPlaylist(playlist._id, track)}
              >
                <FolderHeart size={14} color="var(--accent-purple)" /> {playlist.name}
              </button>
            ))
          )}
        </div>
      )}
    </article>
  );
}
