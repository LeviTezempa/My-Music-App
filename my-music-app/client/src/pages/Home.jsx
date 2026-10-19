import { Disc, Lock } from 'lucide-react';

export default function Home({ onGetStarted }) {
  return (
    <main className="home-page">
      <Disc className="home-icon" size={64} aria-hidden="true" />
      <h1>Music streaming starts here.</h1>
      <p>Create an account or log in to discover music and build your playlists.</p>
      <button className="home-get-started-button" onClick={onGetStarted}>
        <Lock size={18} />
        Get Started Free
      </button>
    </main>
  );
}
