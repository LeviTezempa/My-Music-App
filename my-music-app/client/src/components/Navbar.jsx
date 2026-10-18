// my navigation data

import { Disc, Heart, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({ onLoginClick, user, onLogout, onRestrictedClick }) {
  
  // Navigation gate handler on click without login
  const handleNavClick = (tabName) => {
    if (!user) {
      onRestrictedClick(`Please register an account or log in to explore ${tabName}!`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Disc size={28} color="#1DB954" /> <span>CloudStream</span>
      </div>

      <div className="navbar-actions">
        <button className="navbar-link" onClick={() => handleNavClick('Discover')}>
          <Disc size={18}/> Discover
        </button>
        <button className="navbar-link" onClick={() => handleNavClick('Playlists')}>
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
