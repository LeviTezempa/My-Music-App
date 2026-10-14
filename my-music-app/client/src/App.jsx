//import React from 'react';
import Navbar from './components/Navbar';
import Discover from './pages/Discover';
import Player from './components/Player';

export default function App() {
  return (
    <div style={{ background: '#121212', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <Discover />
      <Player />
    </div>
  );
}
