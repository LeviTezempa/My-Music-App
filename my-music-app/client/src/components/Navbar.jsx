
import { Disc, Heart, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({ onLoginClick, user, onLogout, onRestrictedClick, onTabChange, activeTab }) {
  
  // Navigation gate handler on click without login
  const handleNavClick = (tabName, tabValue) => {
    if (!user) {
      onRestrictedClick(`Please register an account or log in to explore ${tabName}!`);
    } else {
      onTabChange(tabValue); // Switch views when authenticated
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img className="navbar-logo" src="/sonix-logo.png" alt="Sonix" />
      </div>

      <div className="navbar-actions">
        {/* Discover Button - Applies an 'active' class when selected */}
        <button
          className={`navbar-link ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => handleNavClick('Discover', 'discover')}
        >
          <Disc size={18}/> Discover
        </button>

        {/* Playlists Button - Applies an 'active' class when selected */}
        <button
          className={`navbar-link ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => handleNavClick('Playlists', 'playlists')}
        >
          <Heart size={18}/> Playlists
        </button>

        {user ? (
          <div className="navbar-user-actions">
            <span className="navbar-username">
              <User size={16} /> {user}
            </span>
            <button className="navbar-button navbar-logout" onClick={onLogout}>
              <LogOut size={16}/> Logout
            </button>
          </div>
        ) : (
          <button className="navbar-button navbar-login" onClick={onLoginClick}>
            <LogIn size={16}/> Login
          </button>
        )}
      </div>
    </nav>
  );
}
