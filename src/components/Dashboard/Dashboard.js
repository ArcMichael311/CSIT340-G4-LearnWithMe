import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import Decks from '../Decks/Decks';
import Progress from '../Progress/Progress';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [autoStartStudy, setAutoStartStudy] = useState(false);

  const handleDeckSelect = (deck, startStudy = false) => {
    setSelectedDeck(deck);
    setAutoStartStudy(startStudy);
    navigate('/dashboard/flashcards');
  };

  const handleBackToDecks = () => {
    setSelectedDeck(null);
    navigate('/dashboard/decks');
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon"></span>
            <span className="logo-text">LearnWithMe</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${isActive('/dashboard/decks') || isActive('/dashboard/flashcards') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard/decks')}
          >
            <span className="nav-icon">📚</span>
            <span>My Decks</span>
          </button>
          <button 
            className={`nav-item ${isActive('/dashboard/progress') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard/progress')}
          >
            <span className="nav-icon">📊</span>
            <span>Progress</span>
          </button>
          <button 
            className="nav-item"
            onClick={() => navigate('/dashboard/favorites')}
          >
            <span className="nav-icon">⭐</span>
            <span>Favorites</span>
          </button>
          <button 
            className="nav-item"
            onClick={() => navigate('/dashboard/settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-email">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/decks" replace />} />
          <Route 
            path="/decks" 
            element={
              <Decks 
                onDeckSelect={handleDeckSelect}
                selectedDeck={null}
                currentView="decks"
                onBackToDecks={handleBackToDecks}
              />
            } 
          />
          <Route 
            path="/flashcards" 
            element={
              <Decks 
                onDeckSelect={handleDeckSelect}
                selectedDeck={selectedDeck}
                currentView="flashcards"
                onBackToDecks={handleBackToDecks}
                autoStartStudy={autoStartStudy}
              />
            } 
          />
          <Route 
            path="/progress" 
            element={<Progress user={user} onNavigate={(path) => navigate(`/dashboard/${path}`)} />} 
          />
          <Route 
            path="/favorites" 
            element={<div style={{padding: '2rem'}}><h2>Favorites - Coming Soon</h2></div>} 
          />
          <Route 
            path="/settings" 
            element={<div style={{padding: '2rem'}}><h2>Settings - Coming Soon</h2></div>} 
          />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;