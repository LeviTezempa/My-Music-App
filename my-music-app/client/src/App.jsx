
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Auth from './pages/Auth';
import MainRouter from './routes/MainRouter';
import { AudioProvider } from './context/AudioContext';
import { AlertCircle } from 'lucide-react';
import './App.css';

function AppContent() {
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
    <div className="app-shell">
      {alertMessage && (
        <div className="alert-banner">
          <AlertCircle size={18} />
          <span>{alertMessage}</span>
        </div>
      )}

      {showAuth && (
        <Auth
          onLoginSuccess={(username) => setUser(username)}
          onClose={() => setShowAuth(false)}
        />
      )}

      <MainRouter
        user={user}
        setShowAuth={setShowAuth}
        handleLogout={handleLogout}
        setAlertMessage={setAlertMessage}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element "#root" was not found.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);