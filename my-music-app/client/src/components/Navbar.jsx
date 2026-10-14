// my navigation data

import { Disc, Heart, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({ onLoginClick, user, onLogout, onRestrictedClick }) {
  
  // Navigation gate handler on click without login
  const handleNavClick = (tabName) => {
    if (!user) {
      onRestrictedClick(`Please register an account or log in to explore ${tabName}!`);
    }
  };

  {/*My Register and login interfaces*/} 
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 2rem', background: '#111', color: '#fff', borderBottom: '1px solid #222'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
        <Disc size={28} color="#1DB954" /> <span>CloudStream</span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <span 
          onClick={() => handleNavClick('Discover')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <Disc size={18}/> Discover
        </span>
        <span 
          onClick={() => handleNavClick('Playlists')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <Heart size={18}/> Playlists
        </span>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#b3b3b3' }}>
              <User size={16} /> {user}
            </span>
            <button onClick={onLogout} style={{
              background: 'transparent', color: '#b3b3b3', border: '1px solid #444', padding: '0.5rem 1rem', 
              borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer'
            }}>
              <LogOut size={16}/> Logout
            </button>
          </div>
        ) : (
          <button onClick={onLoginClick} style={{
            background: '#1DB954', color: '#fff', border: 'none', padding: '0.5rem 1rem', 
            borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer'
          }}>
            <LogIn size={16}/> Login
          </button>
        )}
      </div>
    </nav>
  );
}
