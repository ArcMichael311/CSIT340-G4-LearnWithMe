import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';

export default function FlashcardCreate({ onSaved }) {
  const { createDeck } = useContext(DataContext);
  const [deckTitle, setDeckTitle] = useState('');
  const [deckDesc, setDeckDesc] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    
    if (!deckTitle.trim()) {
      alert('Deck title is required');
      return;
    }

    createDeck({ 
      userId: 1, 
      title: deckTitle.trim(), 
      description: deckDesc.trim()
    });

    setDeckTitle('');
    setDeckDesc('');
    
    if (onSaved) onSaved();
  };

  return (
    <div className="create-container">
      <h2 className="section-title">📚 Create New Deck</h2>
      <form className="create-form" onSubmit={handleCreate}>
        
        {/* Deck Title */}
        <div className="form-group">
          <label className="form-label">Deck Title *</label>
          <input 
            type="text"
            required 
            value={deckTitle} 
            onChange={e => setDeckTitle(e.target.value)}
            placeholder="e.g., Spanish Basics, Physics 101, etc."
            className="form-input"
          />
        </div>

        {/* Deck Description */}
        <div className="form-group">
          <label className="form-label">Deck Description (Optional)</label>
          <textarea 
            value={deckDesc} 
            onChange={e => setDeckDesc(e.target.value)}
            placeholder="What will you study in this deck?"
            className="form-textarea"
          />
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            ✓ Create Deck
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="info-box">
        <h3>💡 How it works:</h3>
        <ol>
          <li>Create a new deck here</li>
          <li>Go back to Dashboard and click on your deck</li>
          <li>Add multiple flashcards inside the deck</li>
          <li>Click "Start" on any flashcard to study with the timer</li>
        </ol>
      </div>
    </div>
  );
}

