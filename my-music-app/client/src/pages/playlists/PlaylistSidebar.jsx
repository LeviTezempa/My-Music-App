import { FolderHeart, Library, Plus } from 'lucide-react';

export default function PlaylistSidebar({
  playlists,
  selectedPlaylist,
  newPlaylistName,
  onNewPlaylistNameChange,
  onCreatePlaylist,
  onOpenPlaylist,
}) {
  return (
    <aside className="playlist-sidebar">
      <h2 className="playlist-library-heading">
        <Library size={22} color="var(--accent-purple)" /> Your Library
      </h2>

      <form onSubmit={onCreatePlaylist} className="create-playlist-form">
        <input
          type="text"
          placeholder="New Playlist Name"
          value={newPlaylistName}
          onChange={(event) => onNewPlaylistNameChange(event.target.value)}
          className="playlist-input"
        />
        <button type="submit" className="playlist-submit-btn" aria-label="Create playlist">
          <Plus size={20} />
        </button>
      </form>

      <div className="playlist-sidebar-list">
        {playlists.map((playlist) => (
          <button
            type="button"
            key={playlist._id}
            onClick={() => onOpenPlaylist(playlist._id)}
            className={`playlist-sidebar-item ${selectedPlaylist?._id === playlist._id ? 'active' : ''}`}
          >
            <FolderHeart color="var(--accent-purple)" size={20} />
            <div className="playlist-sidebar-item-info">
              <div className="playlist-sidebar-item-name">{playlist.name}</div>
              <div className="playlist-sidebar-item-count">
                Tracks: {playlist.tracks?.length || 0}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
