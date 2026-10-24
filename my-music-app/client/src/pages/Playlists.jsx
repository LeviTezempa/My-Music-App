import { useAudio } from '../hooks/useAudio';
import PlaylistContent from './playlists/PlaylistContent';
import PlaylistSidebar from './playlists/PlaylistSidebar';
import { usePlaylistData } from './playlists/usePlaylistData';

export default function Playlists() {
  const {
    playlists,
    newPlaylistName,
    setNewPlaylistName,
    selectedPlaylist,
    handleCreatePlaylist,
    handleOpenPlaylist,
    handleDeleteTrack,
  } = usePlaylistData();
  const { playTrack } = useAudio();

  return (
    <main className="playlists-page">
      <PlaylistSidebar
        playlists={playlists}
        selectedPlaylist={selectedPlaylist}
        newPlaylistName={newPlaylistName}
        onNewPlaylistNameChange={setNewPlaylistName}
        onCreatePlaylist={handleCreatePlaylist}
        onOpenPlaylist={handleOpenPlaylist}
      />
      <PlaylistContent
        playlist={selectedPlaylist}
        onPlayTrack={playTrack}
        onDeleteTrack={handleDeleteTrack}
      />
    </main>
  );
}
