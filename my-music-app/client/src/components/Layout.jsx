
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Player from './Player';

export default function Layout({ user, onLoginClick, onLogout, onRestrictedClick }) {
  return (
    <div className="layout-shell">
      <Navbar
        onLoginClick={onLoginClick}
        user={user}
        onLogout={onLogout}
        onRestrictedClick={onRestrictedClick}
      />

      <main className="main-content-window">
        <Outlet />
      </main>

      <Player />
    </div>
  );
}
