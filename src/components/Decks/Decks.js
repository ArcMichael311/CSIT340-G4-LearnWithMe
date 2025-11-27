import React, { useState } from 'react';
import './Decks.css';
import Flashcards from '../Flashcards/Flashcards';

const Decks = ({ onDeckSelect, selectedDeck, currentView, onBackToDecks }) => {
  const [decks, setDecks] = useState([
    {
      id: 1,
      title: 'Spanish Vocabulary',
      description: 'Common Spanish words and phrases',
      cardCount: 25,
      color: '#667eea',
      lastStudied: '2 days ago'
    },
    {
      id: 2,
      title: 'Biology Chapter 5',
      description: 'Cell structure and functions',
      cardCount: 42,
      color: '#48bb78',
      lastStudied: '1 week ago'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeck, setNewDeck] = useState({
    title: '',
    description: '',
    color: '#667eea'
  });

  const colors = ['#667eea', '#48bb78', '#f56565', '#ed8936', '#9f7aea', '#38b2ac'];

  const handleCreateDeck = (e) => {
    e.preventDefault();
    const deck = {
      id: Date.now(),
      ...newDeck,
      cardCount: 0,
      lastStudied: 'Never'
    };
    setDecks([...decks, deck]);
    setShowCreateModal(false);
    setNewDeck({ title: '', description: '', color: '#667eea' });
  };

  const handleDeleteDeck = (id) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      setDecks(decks.filter(deck => deck.id !== id));
    }
  };

  // Show flashcards if a deck is selected
  if (currentView === 'flashcards' && selectedDeck) {
    return <Flashcards deck={selectedDeck} onBack={onBackToDecks} />;
  }

  return (
    <div className="decks-container">
      <div className="decks-header">
        <div>
          <h1>My Decks</h1>
          <p>Organize your study materials into decks</p>
        </div>
        <button className="create-deck-btn" onClick={() => setShowCreateModal(true)}>
          <span>+</span> Create New Deck
        </button>
      </div>

      <div className="decks-grid">
        {decks.map(deck => (
          <div key={deck.id} className="deck-card" style={{ borderTopColor: deck.color }}>
            <div className="deck-card-header">
              <div className="deck-color-dot" style={{ background: deck.color }}></div>
              <button 
                className="deck-delete-btn"
                onClick={() => handleDeleteDeck(deck.id)}
                title="Delete deck"
              >
                🗑️
              </button>
            </div>
            
            <h3 className="deck-title">{deck.title}</h3>
            <p className="deck-description">{deck.description}</p>
            
            <div className="deck-stats">
              <div className="stat">
                <span className="stat-icon">📇</span>
                <span>{deck.cardCount} cards</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🕒</span>
                <span>{deck.lastStudied}</span>
              </div>
            </div>

            <div className="deck-actions">
              <button 
                className="deck-action-btn primary"
                onClick={() => onDeckSelect(deck)}
              >
                Study Now
              </button>
              <button 
                className="deck-action-btn secondary"
                onClick={() => onDeckSelect(deck)}
              >
                View Cards
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {decks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No decks yet</h3>
            <p>Create your first deck to start studying!</p>
            <button className="create-deck-btn" onClick={() => setShowCreateModal(true)}>
              <span>+</span> Create Deck
            </button>
          </div>
        )}
      </div>

      {/* Create Deck Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Deck</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateDeck}>
              <div className="form-group">
                <label>Deck Title</label>
                <input
                  type="text"
                  placeholder="e.g., Spanish Vocabulary"
                  value={newDeck.title}
                  onChange={(e) => setNewDeck({ ...newDeck, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="What will you study in this deck?"
                  value={newDeck.description}
                  onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Choose a Color</label>
                <div className="color-picker">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${newDeck.color === color ? 'selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => setNewDeck({ ...newDeck, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-create">
                  Create Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Decks;