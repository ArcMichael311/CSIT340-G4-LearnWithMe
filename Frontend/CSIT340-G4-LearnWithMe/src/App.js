import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    // Initialize state from localStorage
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist user data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Handle successful login
  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  // Handle logout
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
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-text">LearnWithMe</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <button 
              className="nav-btn login-btn" 
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="nav-btn signup-btn" 
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Master Any Subject with
            <span className="gradient-text"> Smart Flashcards</span>
          </h1>
          <p className="hero-subtitle">
            Study smarter, not harder. Create, share, and learn with powerful flashcards 
            designed to help you ace your exams and retain information longer.
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
        <div className="hero-illustration">
          <div className="flashcard-demo">
            <div className="flashcard card-1">
              <div className="card-front">What is photosynthesis?</div>
            </div>
            <div className="flashcard card-2">
              <div className="card-front">Define Machine Learning</div>
            </div>
            <div className="flashcard card-3">
              <div className="card-front">Spanish: "Hello"</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2 className="section-title">Why Choose LearnWithMe?</h2>
        <p className="section-subtitle">Everything you need to succeed in your studies</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Smart Study Mode</h3>
            <p>AI-powered spaced repetition ensures you review cards at the perfect time for maximum retention.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Study Anywhere</h3>
            <p>Access your flashcards on any device. Study on the go with our mobile-friendly platform.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Collaborative Learning</h3>
            <p>Share decks with classmates, study together, and learn from the community.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Track Progress</h3>
            <p>Visualize your learning journey with detailed analytics and performance insights.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Quick Creation</h3>
            <p>Create flashcards in seconds with our intuitive editor and bulk import tools.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Customizable</h3>
            <p>Add images, audio, and formatting to make your flashcards truly memorable.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Start learning in three simple steps</p>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Your Deck</h3>
            <p>Build flashcard decks for any subject. Add text, images, and audio to enhance learning.</p>
          </div>
          
          <div className="step-connector"></div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Study Smart</h3>
            <p>Use our intelligent study modes that adapt to your learning pace and style.</p>
          </div>
          
          <div className="step-connector"></div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Track & Improve</h3>
            <p>Monitor your progress and watch your knowledge grow over time.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Learning?</h2>
          <p>Join over 10,000 students who are already studying smarter with LearnWithMe</p>
          <button 
            className="cta-primary large" 
            onClick={() => navigate('/register')}
          >
            Start Learning for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-bottom">
          <p>&copy; 2024 LearnWithMe. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;