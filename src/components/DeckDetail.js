import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import FlashcardCard from './FlashcardCard';
import TimerInput from './TimerInput';

export default function DeckDetail({ deckId, onBack }) {
  const { data, createFlashcard } = useContext(DataContext);
  const deck = data.decks.find(d => d.id === deckId);
  const flashcards = data.flashcards.filter(fc => fc.deckId === deckId);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(30);

  if (!deck) {
    return (
      <div className="deck-detail-container">
        <button onClick={onBack} className="btn-back">← Back to Dashboard</button>
        <div className="empty-state">Deck not found</div>
      </div>
    );
  }

  const handleAddFlashcard = (e) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim()) {
      alert('Question and answer are required');
      return;
    }

    createFlashcard({
      deckId: deckId,
      front: front.trim(),
      back: back.trim(),
      timerSeconds: Number(timerSeconds)
    });

    setFront('');
    setBack('');
    setTimerSeconds(30);
    setShowAddForm(false);
  };

  return (
    <div className="deck-detail-container">
      <div className="deck-detail-header">
        <button onClick={onBack} className="btn-back">← Back</button>
        <div className="deck-detail-title">
          <h1>{deck.title}</h1>
          <p>{deck.description}</p>
        </div>
        <div className="deck-stats">
          <div className="stat">{flashcards.length} cards</div>
        </div>
      </div>

      {/* Add Flashcard Form */}
      <div className="deck-detail-form-section">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-toggle-form"
        >
          {showAddForm ? '✕ Cancel' : '+ Add Flashcard to This Deck'}
        </button>

        {showAddForm && (
          <form className="deck-add-form" onSubmit={handleAddFlashcard}>
            <div className="form-group">
              <label className="form-label">Question (Front) *</label>
              <textarea
                required
                value={front}
                onChange={e => setFront(e.target.value)}
                placeholder="Enter the question or prompt"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Answer (Back) *</label>
              <textarea
                required
                value={back}
                onChange={e => setBack(e.target.value)}
                placeholder="Enter the answer or definition"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <TimerInput
                value={timerSeconds}
                onChange={setTimerSeconds}
                label="⏱️ Study Time per Card"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                ✓ Save Flashcard
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Flashcards List */}
      <section className="deck-flashcards-section">
        <h2 className="section-title">📋 Flashcards in this deck</h2>
        {flashcards.length === 0 ? (
          <div className="empty-state">
            <p>No flashcards in this deck yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="deck-flashcards-grid">
            {flashcards.map(card => (
              <FlashcardCard
                key={card.id}
                card={card}
                deckTitle={deck.title}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
