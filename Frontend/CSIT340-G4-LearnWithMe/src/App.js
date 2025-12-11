import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard/*" 
          element={
            currentUser ? (
              <Dashboard user={currentUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-text">LearnWithMe</span>
          </div>

          <div className="nav-links">
            {/* NEW LOGIN BUTTON */}
            <button 
              className="btn-login-new"
              onClick={() => navigate('/login')}
            >
              Login
            </button>

            {/* NEW SIGNUP BUTTON */}
            <button 
              className="btn-signup-new"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Master Any Subject with
            <span className="gradient-text"> Smart Flashcards</span>
          </h1>

          <p className="hero-subtitle">
            Study smarter, not harder. Create, share, and learn with powerful flashcards.
          </p>

          <div className="hero-buttons">
            <button 
              className="cta-primary" 
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </button>
          </div>

          <p className="hero-note">No credit card required • Free forever</p>
        </div>
      </section>

      {/* MORE SECTIONS… (unchanged) */}
    </div>
  );
}

export default App;
