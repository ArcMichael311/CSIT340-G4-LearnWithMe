import React, { useState } from 'react';
import './Login.css';

const Login = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    
    // Simulate successful login
    const userData = {
      email: formData.email,
      name: formData.email.split('@')[0]
    };
    
    onLogin(userData);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back!</h1>
          <p>Sign in to continue your learning journey</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button type="button" className="google-btn">
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Continue with Google
          </button>

          <p className="signup-link">
            Don't have an account? <a href="#register" onClick={(e) => { e.preventDefault(); onNavigate('register'); }}>Sign Up</a>
          </p>
        </form>

        <button className="back-to-home" onClick={() => onNavigate('landing')}>
          ← Back to Home
        </button>
      </div>

      <div className="login-illustration">
        <div className="illustration-content">
          <h2>LearnWithMe</h2>
          <p>Master any subject with smart flashcards</p>
          <div className="features">
            <div className="feature-item">✓ Create custom flashcards</div>
            <div className="feature-item">✓ Study on any device</div>
            <div className="feature-item">✓ Track your progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;