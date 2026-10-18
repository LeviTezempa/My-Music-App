import { useState } from 'react';
import axios from 'axios';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';
import API_URL from '../api';

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
    <div className="auth-overlay">
      <div className="auth-dialog">
        <button className="auth-close-button" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2 className="auth-heading">
          {isRegister
            ? <UserPlus color="var(--accent-purple)" />
            : <LogIn color="var(--accent-purple)" />}
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="auth-input-wrap">
              <User className="auth-input-icon" size={18} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="auth-input-wrap">
            <Mail className="auth-input-icon" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-input-wrap">
            <Lock className="auth-input-icon" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button className="auth-submit-button" type="submit" disabled={loading}>
            {loading ? 'Processing...' : isRegister ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="auth-switch-button"
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
          >
            {isRegister ? 'Log In' : 'Register Here'}
          </button>
        </div>
      </div>
    </div>
  );
}
