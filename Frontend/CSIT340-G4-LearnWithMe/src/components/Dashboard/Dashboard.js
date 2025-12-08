import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import Decks from '../Decks/Decks';
import Progress from '../Progress/Progress';
import Categories from '../Categories/Categories';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDeck, setSelectedDeck] = useState(null);

  const handleDeckSelect = (deck) => {
    setSelectedDeck(deck);
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
          <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <svg className="logo-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <rect width="512" height="380" rx="30" fill="#f2b705"/>
              <path d="M60,350 L60,400 L100,400 Z" fill="#f2b705"/>
              <g fill="#f2522e">
                <path d="M85,160 L75,180 L85,180 C92,180 98,186 98,193 C98,200 92,206 85,206 C78,206 72,200 72,193 L62,193 C62,206 72,216 85,216 C98,216 108,206 108,193 C108,180 98,170 85,170 Z"/>
                <rect x="85" y="148" width="30" height="4" rx="2"/>
                <path d="M60,220 C60,220 75,280 85,300 C95,280 110,220 110,220 L95,200 L75,200 Z"/>
                <text x="170" y="270" font-size="120" font-weight="bold" font-family="Arial, sans-serif">LWM</text>
              </g>
            </svg>
            <span className="logo-text">LearnWithMe</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${isActive('/dashboard/decks') || isActive('/dashboard/flashcards') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard/decks')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <span>My Decks</span>
          </button>
          <button 
            className={`nav-item ${isActive('/dashboard/categories') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard/categories')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>
            </svg>
            <span>Categories</span>
          </button>
          <button 
            className={`nav-item ${isActive('/dashboard/progress') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard/progress')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            <span>Progress</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.fullName || 'User'}</div>
              <div className="user-email">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Logout
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
              />
            } 
          />
          <Route 
            path="/categories" 
            element={<Categories />} 
          />
          <Route 
            path="/progress" 
            element={<Progress user={user} onNavigate={(path) => navigate(`/dashboard/${path}`)} />} 
          />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;