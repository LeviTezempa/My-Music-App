import { Search, X } from 'lucide-react';

export default function DiscoverSearch({ searchQuery, onSearchChange, onClearSearch }) {
  return (
    <form
      className="search-wrap"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <Search className="search-icon" size={20} aria-hidden="true" />
      <input
        className="search-input"
        type="search"
        placeholder="Search songs or artists"
        aria-label="Search songs or artists"
        value={searchQuery}
        onChange={onSearchChange}
      />
      {searchQuery && (
        <button
          className="search-clear-button"
          type="button"
          aria-label="Clear search"
          onClick={onClearSearch}
        >
          <X size={18} />
        </button>
      )}
    </form>
  );
}
