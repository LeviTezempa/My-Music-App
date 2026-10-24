import { useAudio } from '../hooks/useAudio';
import { useDiscoverData } from './discover/useDiscoverData';
import DiscoverSearch from './discover/DiscoverSearch';
import DiscoverTrackCard from './discover/DiscoverTrackCard';

export default function Discover() {
  const {
    tracks,
    playlists,
    searchQuery,
    isLoadingTracks,
    tracksError,
    activeDropdown,
    setActiveDropdown,
    handleAddToPlaylist,
    clearSearch,
    handleSearchChange,
  } = useDiscoverData();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  return (
    <main className="discover-page">
      <DiscoverSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
      />

      <h1 className="discover-heading">
        {searchQuery.trim() ? 'Search Results' : 'Trending Hits'}
      </h1>

      {isLoadingTracks ? (
        <div className="empty-results" role="status">Searching music...</div>
      ) : tracksError ? (
        <div className="empty-results" role="alert">{tracksError}</div>
      ) : tracks.length === 0 ? (
        <div className="empty-results">
          {searchQuery.trim()
            ? `No songs or artists found for "${searchQuery.trim()}".`
            : 'No trending songs are available right now.'}
        </div>
      ) : (
        <div className="track-grid">
          {tracks.map((track) => (
            <DiscoverTrackCard
              key={track.spotifyId}
              track={track}
              tracks={tracks}
              playlists={playlists}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              activeDropdown={activeDropdown}
              onPlayTrack={playTrack}
              onTogglePlay={togglePlay}
              onToggleDropdown={setActiveDropdown}
              onAddToPlaylist={handleAddToPlaylist}
            />
          ))}
        </div>
      )}
    </main>
  );
}
