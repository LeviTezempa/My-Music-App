
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Discover from './pages/Discover';
import Player from './components/Player';
import Auth from './pages/Auth';
import { Disc, Lock, AlertCircle } from 'lucide-react';

export default function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
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
  };

  return (
    <div style={{ background: '#121212', minHeight: '100vh', fontFamily: 'sans-serif', color: '#fff', position: 'relative' }}>
      
      {/* Floating Restricted Notification Banner */}
      {alertMessage && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          background: '#ff5c5c', color: '#fff', padding: '0.85rem 1.5rem', borderRadius: '30px',
          display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 2000, transition: 'all 0.3s ease'
        }}>
          <AlertCircle size={18} />
          <span>{alertMessage}</span>
        </div>
      )}

      <Navbar 
        onLoginClick={() => setShowAuth(true)} 
        user={user} 
        onLogout={handleLogout} 
        onRestrictedClick={(msg) => setAlertMessage(msg)}
      />
      
      {user ? (
        <Discover />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', gap: '1rem' }}>
          <Disc size={64} color="#1DB954" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Music streaming starts here.</h1>
          <p style={{ color: '#b3b3b3', marginBottom: '1rem' }}>Sign up or log in to explore trending hits and save your playlists.</p>
          <button onClick={() => setShowAuth(true)} style={{
            background: '#1DB954', color: '#fff', border: 'none', padding: '0.85rem 2rem', 
            borderRadius: '25px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <Lock size={18}/> Get Started Free
          </button>
        </div>
      )}

      <Player />

      {showAuth && (
        <Auth onLoginSuccess={(username) => setUser(username)} onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}
