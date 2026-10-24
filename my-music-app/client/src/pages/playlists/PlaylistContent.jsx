import { FolderHeart, Play, Trash2 } from 'lucide-react';

export default function PlaylistContent({ playlist, onPlayTrack, onDeleteTrack }) {
  return (
    <section className="playlist-content-view">
      {playlist && playlist._id ? (
        <div className="active-playlist-wrapper">
          <h1 className="active-playlist-heading">
            <FolderHeart size={36} color="var(--accent-purple)" /> {playlist.name}
          </h1>

          {playlist.tracks && playlist.tracks.length === 0 ? (
            <div className="empty-playlist-msg">
              This playlist is currently empty. Go over to <strong>Discover</strong> to find some tracks!
            </div>
          ) : (
            <div className="playlist-track-rows-container">
              {playlist.tracks.map((track, index) => (
                <div key={track._id} className="playlist-track-row">
                  <div className="playlist-track-details">
                    <span className="playlist-track-index">{index + 1}</span>
                    <img
                      className="playlist-track-artwork"
                      src={track.artwork || '/music-artwork-placeholder.svg'}
                      alt={`${track.title} artwork`}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = '/music-artwork-placeholder.svg';
                      }}
                    />
                    <div className="playlist-track-info">
                      <div className="playlist-track-title">{track.title}</div>
                      <div className="playlist-track-artist">{track.artist}</div>
                    </div>
                  </div>

                  <div className="playlist-track-actions">
                    <button
                      type="button"
                      aria-label={`Play ${track.title}`}
                      onClick={() => onPlayTrack(track, playlist.tracks)}
                      className="playlist-row-play-btn"
                    >
                      <Play className="player-play-icon" size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${track.title}`}
                      onClick={() => onDeleteTrack(track._id)}
                      className="playlist-row-delete-btn"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="playlist-empty-selection">
          <FolderHeart size={48} color="#282828" />
          <span>Select a playlist from the library side panel to view your saved songs.</span>
        </div>
      )}
    </section>
  );
}
