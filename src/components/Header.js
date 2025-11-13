import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/LearnWithMe.png';

export default function Header({ view, onNavigate, onLogout }) {
  const { currentUser } = useContext(AuthContext);

  return (
    <header className="app-header">
      <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src={logo}
          alt="LearnWithMe Logo"
          style={{ width: 48, height: 48, objectFit: 'contain' }}
        />
        <h1>LearnWithMe</h1>
      </div>

      <div className="header-user">
        {currentUser && (
          <>
            <nav className="header-nav">
              <button 
                className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`}
                onClick={() => onNavigate('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`nav-btn ${view === 'create' ? 'active' : ''}`}
                onClick={() => onNavigate('create')}
              >
                + Create Deck
              </button>
            </nav>
            <span className="user-name">👤 {currentUser.username}</span>
            <button 
              onClick={onLogout}
              className="btn-logout"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

