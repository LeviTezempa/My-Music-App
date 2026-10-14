import { Disc, Heart, LogIn } from 'lucide-react';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 2rem', background: '#111', color: '#fff', borderBottom: '1px solid #222',
      position: 'sticky', top: 0, zIndex: 50
    }}>
      {/* Brand Header Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
        <Disc size={28} color="#1DB954" /> <span>CloudStream</span>
      </div>

      {/* Nav Link Directories */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fff', fontWeight: 500 }}>
          <Disc size={18} color="#1DB954" /> Discover
        </span>
        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#b3b3b3' }}>
          <Heart size={18}/> Playlists
        </span>
        <button style={{
          background: '#1DB954', color: '#fff', border: 'none', padding: '0.5rem 1rem', 
          borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer',
          transition: 'transform 0.15s ease'
        }}>
          <LogIn size={16}/> Login
        </button>
      </div>
    </nav>
  );
}
