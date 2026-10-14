// My login from


import { useState } from 'react';
import axios from 'axios';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';

export default function Auth({ onLoginSuccess, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const endpoint = isRegister ? `${API_URL}/auth/register` : `${API_URL}/auth/login`;

    try {
      const response = await axios.post(endpoint, formData); // Links out frontend to backend api and fatches json data.
      const { token, username } = response.data;

      // Save credentials locally
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      onLoginSuccess(username);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#181818', width: '100%', maxWidth: '400px', padding: '2.5rem',
        borderRadius: '12px', border: '1px solid #282828', color: '#fff', position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem', background: 'none',
          border: 'none', color: '#b3b3b3', fontSize: '1.25rem', cursor: 'pointer'
        }}>✕</button>

        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isRegister ? <UserPlus color="#1DB954"/> : <LogIn color="#1DB954"/>}
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && <div style={{ color: '#ff5c5c', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isRegister && (
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#b3b3b3' }} />
              <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: '#242424', border: '1px solid #333', borderRadius: '6px', color: '#fff' }} />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#b3b3b3' }} />
            <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: '#242424', border: '1px solid #333', borderRadius: '6px', color: '#fff' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#b3b3b3' }} />
            <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: '#242424', border: '1px solid #333', borderRadius: '6px', color: '#fff' }} />
          </div>

          <button type="submit" disabled={loading} style={{
            background: '#1DB954', color: '#fff', border: 'none', padding: '0.75rem',
            borderRadius: '25px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem'
          }}>
            {loading ? 'Processing...' : isRegister ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#b3b3b3' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => { setIsRegister(!isRegister); setError(''); }} style={{ color: '#1DB954', cursor: 'pointer', fontWeight: 'bold' }}>
            {isRegister ? 'Log In' : 'Register Here'}
          </span>
        </div>
      </div>
    </div>
  );
}
