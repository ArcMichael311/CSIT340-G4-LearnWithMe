import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Register({ onSwitchToLogin }) {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!username.trim()) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Simulate network delay
    setTimeout(() => {
      const result = register(username, email, password);
      if (!result.success) {
        setError(result.error);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">🧠 LearnWithMe</h1>
            <p className="auth-subtitle">Create Your Account</p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-form-group">
              <label className="auth-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="auth-input"
                disabled={loading}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="auth-input"
                disabled={loading}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a password (min 6 characters)"
                className="auth-input"
                disabled={loading}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="auth-input"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account?</p>
            <button 
              onClick={onSwitchToLogin}
              className="auth-link-btn"
              disabled={loading}
            >
              Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
