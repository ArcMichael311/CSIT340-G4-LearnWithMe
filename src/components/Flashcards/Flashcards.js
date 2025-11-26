import React, { useState } from 'react';
import './Flashcards.css';

const Flashcards = ({ deck, onBack }) => {
  const [flashcards, setFlashcards] = useState([
    {
      id: 1,
      front: 'What is photosynthesis?',
      back: 'The process by which plants use sunlight, water and carbon dioxide to produce oxygen and energy in the form of sugar.'
    },
    {
      id: 2,
      front: '¿Cómo estás?',
      back: 'How are you? (Spanish)'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCreateCard = (e) => {
    e.preventDefault();
    const card = {
      id: Date.now(),
      ...newCard
    };
    setFlashcards([...flashcards, card]);
    setShowCreateModal(false);
    setNewCard({ front: '', back: '' });
  };

  const handleDeleteCard = (id) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      setFlashcards(flashcards.filter(card => card.id !== id));
    }
  };

  const handleStartStudy = () => {
    if (flashcards.length === 0) {
      alert('Add some flashcards first!');
      return;
    }
    setStudyMode(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setStudyMode(false);
      alert('Great job! You\'ve reviewed all cards.');
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Study Mode View
  if (studyMode) {
    const currentCard = flashcards[currentCardIndex];
    
    return (
      <div className="study-mode">
        <div className="study-header">
          <button className="back-btn" onClick={() => setStudyMode(false)}>
            ← Exit Study Mode
          </button>
          <div className="progress-info">
            Card {currentCardIndex + 1} of {flashcards.length}
          </div>
        </div>

        <div className="study-container">
          <div 
            className={`study-card ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="card-face front">
              <div className="card-label">Question</div>
              <div className="card-content">{currentCard.front}</div>
              <div className="flip-hint">Click to flip</div>
            </div>
            <div className="card-face back">
              <div className="card-label">Answer</div>
              <div className="card-content">{currentCard.back}</div>
              <div className="flip-hint">Click to flip</div>
            </div>
          </div>

          <div className="study-controls">
            <button 
              className="control-btn"
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
            >
              ← Previous
            </button>
            <button 
              className="control-btn flip"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              🔄 Flip Card
            </button>
            <button 
              className="control-btn"
              onClick={handleNextCard}
            >
              Next →
            </button>
          </div>

          <div className="study-progress">
            <div 
              className="progress-bar"
              style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Card Management View
  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <div>
          <button className="back-btn" onClick={onBack}>
            ← Back to Decks
          </button>
          <h1>{deck.title}</h1>
          <p>{deck.description}</p>
        </div>
        <div className="header-actions">
          <button className="study-btn" onClick={handleStartStudy}>
            <span>🎯</span> Study Mode
          </button>
          <button className="create-card-btn" onClick={() => setShowCreateModal(true)}>
            <span>+</span> Add Card
          </button>
        </div>
      </div>

      <div className="cards-grid">
        {flashcards.map((card, index) => (
          <div key={card.id} className="flashcard-item">
            <div className="card-number">#{index + 1}</div>
            <div className="card-content-preview">
              <div className="card-side">
                <div className="side-label">Front</div>
                <div className="side-text">{card.front}</div>
              </div>
              <div className="card-divider">⟷</div>
              <div className="card-side">
                <div className="side-label">Back</div>
                <div className="side-text">{card.back}</div>
              </div>
            </div>
            <button 
              className="delete-card-btn"
              onClick={() => handleDeleteCard(card.id)}
            >
              🗑️ Delete
            </button>
          </div>
        ))}

        {flashcards.length === 0 && (
          <div className="empty-cards">
            <div className="empty-icon">📇</div>
            <h3>No flashcards yet</h3>
            <p>Create your first flashcard to start studying!</p>
            <button className="create-card-btn" onClick={() => setShowCreateModal(true)}>
              <span>+</span> Add Card
            </button>
          </div>
        )}
      </div>

      {/* Create Card Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Flashcard</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateCard}>
              <div className="form-group">
                <label>Front (Question)</label>
                <textarea
                  placeholder="Enter your question or term..."
                  value={newCard.front}
                  onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Back (Answer)</label>
                <textarea
                  placeholder="Enter the answer or definition..."
                  value={newCard.back}
                  onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  rows="4"
                  required
                />
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
                  Create Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;