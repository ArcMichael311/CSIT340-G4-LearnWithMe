import React, { useState } from 'react';
import './Dashboard.css';
import Decks from '../Decks/Decks';

const Dashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('decks');
  const [selectedDeck, setSelectedDeck] = useState(null);

  const handleDeckSelect = (deck) => {
    setSelectedDeck(deck);
    setCurrentView('flashcards');
  };

  const handleBackToDecks = () => {
    setSelectedDeck(null);
    setCurrentView('decks');
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">LearnWithMe</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${currentView === 'decks' ? 'active' : ''}`}
            onClick={handleBackToDecks}
          >
            <span className="nav-icon">🗂️</span>
            <span>My Decks</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">📊</span>
            <span>Progress</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">⭐</span>
            <span>Favorites</span>
          </button>
          <button className="nav-item">
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
        <Decks 
          onDeckSelect={handleDeckSelect}
          selectedDeck={selectedDeck}
          currentView={currentView}
          onBackToDecks={handleBackToDecks}
        />
      </main>
    </div>
  );
};

export default Dashboard;