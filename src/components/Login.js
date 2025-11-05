import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login({ onSwitchToRegister }) {
  const { login } = useContext(AuthContext);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!usernameOrEmail.trim()) {
      setError('Username or email is required');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    // Simulate network delay
    setTimeout(() => {
      const result = login(usernameOrEmail, password);
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
            <p className="auth-subtitle">Welcome Back</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-form-group">
              <label className="auth-label">Username or Email</label>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={e => setUsernameOrEmail(e.target.value)}
                placeholder="Enter your username or email"
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
                placeholder="Enter your password"
                className="auth-input"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account?</p>
            <button 
              onClick={onSwitchToRegister}
              className="auth-link-btn"
              disabled={loading}
            >
              Create one here
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="auth-demo">
            <p className="demo-label">Demo Account:</p>
            <p className="demo-text">Username: <strong>demo</strong></p>
            <p className="demo-text">Password: <strong>demo123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
