

import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Discover from '../pages/Discover';
import Playlists from '../pages/Playlists';
import Layout from '../components/Layout';

const ProtectedRoute = ({ user, children, onRestrictedTrigger, featureName }) => {
  useEffect(() => {
    if (!user) {
      onRestrictedTrigger(`Please log in or register an account to access ${featureName}!`);
    }
  }, [user, onRestrictedTrigger, featureName]);

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function MainRouter({ user, setShowAuth, handleLogout, setAlertMessage }) {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Layout 
            user={user} 
            onLoginClick={() => setShowAuth(true)} 
            onLogout={handleLogout} 
            onRestrictedClick={setAlertMessage}
          />
        }
      >
        <Route
          index
          element={user ? <Navigate to="/discover" replace /> : <Home onGetStarted={() => setShowAuth(true)} />}
        />
        <Route
          path="discover"
          element={
            <ProtectedRoute
              user={user}
              onRestrictedTrigger={setAlertMessage}
              featureName="Discover"
            >
              <Discover />
            </ProtectedRoute>
          }
        />
        <Route 
          path="playlists" 
          element={
            <ProtectedRoute
              user={user}
              onRestrictedTrigger={setAlertMessage}
              featureName="Playlists"
            >
              <Playlists />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
