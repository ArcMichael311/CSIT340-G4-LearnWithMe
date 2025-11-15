import React from 'react';

export default function DecksList({ decks = [], flashcards = [], categories = [], onDeleteDeck, onSelectDeck, onStudyDeck }) {
  const getCardCount = (deckId) => flashcards.filter(f => f.deckId === deckId).length;
  
  const getCategoryNames = (deckId) => {
    const deckCats = categories.filter(cat => 
      cat.deckId === deckId
    );
    return deckCats.map(c => c.name).join(', ') || 'Uncategorized';
  };

  return (
    <div className="decks-container">
      <h2 className="section-title">📚 Your Decks</h2>
      {decks.length === 0 ? (
        <div className="empty-state">
          <p>No decks yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="decks-grid">
          {decks.map(deck => {
            const count = getCardCount(deck.id);
            return (
              <div key={deck.id} className="deck-card">
                <div 
                  className="deck-card-clickable"
                  onClick={() => onSelectDeck && onSelectDeck(deck.id)}
                >
                  <div className="deck-card-header">
                    <h3>{deck.title}</h3>
                    <div className="deck-card-actions">
                      <span className="deck-badge">{count} cards</span>
                    </div>
                  </div>
                  <p className="deck-description">{deck.description}</p>
                  <div className="deck-footer">
                    <span className="deck-category">{getCategoryNames(deck.id)}</span>
                  </div>
                </div>
                <div className="deck-card-buttons">
                  {count > 0 && onStudyDeck && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStudyDeck(deck.id);
                      }}
                      className="btn-study-deck"
                      title="Study this deck"
                    >
                      📖 Study
                    </button>
                  )}
                  {onDeleteDeck && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete deck "${deck.title}" and all its flashcards?`)) {
                          onDeleteDeck(deck.id);
                        }
                      }}
                      className="deck-delete-btn"
                      title="Delete deck"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
