
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Discover from './pages/Discover';
import Playlists from './pages/Playlists';
import Player from './components/Player';
import Auth from './pages/Auth';
import { Disc, Lock, AlertCircle } from 'lucide-react';
import './App.css';

export default function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [activeTab, setActiveTab] = useState('discover'); // Handles panel navigation
  const [user, setUser] = useState(() => localStorage.getItem('username') || null);

  // Auto-hide notification popups after 4 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    setActiveTab('discover');
  };

  return (
    <div className="app-shell">
      {alertMessage && (
        <div className="alert-banner">
          <AlertCircle size={18} />
          <span>{alertMessage}</span>
        </div>
      )}

      <Navbar
        onLoginClick={() => setShowAuth(true)}
        user={user}
        onLogout={handleLogout}
        onRestrictedClick={(msg) => setAlertMessage(msg)}
        onTabChange={(tab) => setActiveTab(tab)}
        activeTab={activeTab}
      />

      {!user ? (
        <div className="welcome-panel">
          <Disc size={64} color="var(--accent-purple)" />
          <h1>Music streaming starts here.</h1>
          <p>Sign up or log in to explore trending hits and save your playlists.</p>
          <button className="get-started-button" onClick={() => setShowAuth(true)}>
            <Lock size={18} /> Get Started Free
          </button>
        </div>
      ) : activeTab === 'discover' ? (
        <Discover />
      ) : (
        <Playlists />
      )}

      <Player />

      {showAuth && (
        <Auth
          onLoginSuccess={(username) => setUser(username)}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}