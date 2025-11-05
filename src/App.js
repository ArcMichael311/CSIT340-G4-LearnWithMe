import React, { useState, useContext } from 'react';
import './App.css';
import DataProvider, { DataContext } from './context/DataContext';
import AuthProvider, { AuthContext } from './context/AuthContext';
import Header from './components/Header';
import DecksList from './components/DecksList';
import DeckDetail from './components/DeckDetail';
import StudyMode from './components/StudyMode';
import FlashcardCreate from './components/FlashcardCreate';
import FlashcardCard from './components/FlashcardCard';
import Login from './components/Login';
import Register from './components/Register';

function AppContent() {
  const [view, setView] = useState('dashboard');
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const { data, getFlashcardsForDeck, deleteDeck } = useContext(DataContext);
  const { currentUser, logout } = useContext(AuthContext);

  // If not authenticated, show login/register
  if (!currentUser) {
    return (
      <>
        {authView === 'login' ? (
          <Login onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthView('login')} />
        )}
      </>
    );
  }

  // For dashboard category display
  const deckCategories = data.deck_categories.map(dc => ({
    deckId: dc.deckId,
    name: data.categories.find(c => c.id === dc.categoryId)?.name || 'N/A'
  }));

  const handleSelectDeck = (deckId) => {
    setSelectedDeckId(deckId);
    setView('deck-detail');
  };

  const handleStudyDeck = (deckId) => {
    setSelectedDeckId(deckId);
    setView('study');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setSelectedDeckId(null);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-root">
      <Header view={view} onNavigate={setView} onLogout={handleLogout} />
      
      <main className="app-main">
        {view === 'dashboard' && (
          <section className="dashboard-view">
            <div className="dashboard-hero">
              <div className="hero-content">
                <h1>Welcome to Your LearnWithMe Study Hub</h1>
                <h3>Master any subject with interactive flashcards.</h3>
                <p>Created by: Fernandez, Cambal, Lim </p>
              </div>
            </div>

            {/* Decks Section */}
            <DecksList 
              decks={data.decks} 
              flashcards={data.flashcards}
              categories={deckCategories}
              onDeleteDeck={deleteDeck}
              onSelectDeck={handleSelectDeck}
              onStudyDeck={handleStudyDeck}
            />

            {/* Stats Section */}
            <section className="stats-section">
              <h2 className="section-title">📊 Stats</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{data.decks.length}</div>
                  <div className="stat-label">Total Decks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{data.flashcards.length}</div>
                  <div className="stat-label">Total Cards</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{data.progress.length}</div>
                  <div className="stat-label">Practice Sessions</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{data.categories.length}</div>
                  <div className="stat-label">Categories</div>
                </div>
              </div>
            </section>
          </section>
        )}

        {view === 'study' && selectedDeckId && (
          <section className="study-view">
            <StudyMode deckId={selectedDeckId} onBack={handleBackToDashboard} />
          </section>
        )}

        {view === 'create' && (
          <section className="create-view">
            <FlashcardCreate onSaved={() => setView('dashboard')} />
          </section>
        )}

        {view === 'deck-detail' && selectedDeckId && (
          <section className="deck-detail-view">
            <DeckDetail deckId={selectedDeckId} onBack={handleBackToDashboard} />
          </section>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
