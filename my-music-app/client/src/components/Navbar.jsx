// Navigation and User Profile
import { Disc, Heart, LogIn, LogOut, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ onLoginClick, user, onLogout, onRestrictedClick }) {
  const handleRestrictedClick = (event, featureName) => {
    if (!user) {
      event.preventDefault();
      onRestrictedClick(`Please log in or register an account to access ${featureName}!`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img className="navbar-logo" src="/sonix-logo.png" alt="Sonix" />
      </div>

      <div className="navbar-actions">
        <NavLink
          className="navbar-link"
          to="/discover"
          onClick={(event) => handleRestrictedClick(event, 'Discover')}
        >
          <Disc size={18}/> Discover
        </NavLink>

        <NavLink
          className="navbar-link"
          to="/playlists"
          onClick={(event) => handleRestrictedClick(event, 'Playlists')}
        >
          <Heart size={18}/> Playlists
        </NavLink>

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
