import React, { useEffect, useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';

export default function FlashcardCard({ card = {}, deckTitle = '' }) {
  const { deleteFlashcard } = useContext(DataContext);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(card.timerSeconds || 0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setSecondsLeft(card.timerSeconds || 0);
  }, [card]);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      setRunning(false);
      setFlipped(true); // Auto-flip when timer reaches 0
      return;
    }
    
    const id = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);
    
    return () => clearInterval(id);
  }, [running, secondsLeft]);

  const handleStart = () => {
    setRunning(true);
    setSecondsLeft(card.timerSeconds || 0);
  };

  const handleStop = () => {
    setRunning(false);
    setSecondsLeft(card.timerSeconds || 0);
  };

  const timerColor = secondsLeft > 10 ? '#4ade80' : secondsLeft > 0 ? '#fbbf24' : '#ef4444';

  return (
    <div className="flashcard-container">
      <div className="flashcard-header">
        <span className="flashcard-deck-badge">{deckTitle}</span>
        <span className={`timer-badge ${running ? 'active' : ''}`} style={{ color: timerColor }}>
          {secondsLeft}s
        </span>
      </div>
      
      <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
        <div className="flashcard-face front">
          <div className="face-label">Question</div>
          <div className="face-content">{card.front || 'N/A'}</div>
        </div>
        <div className="flashcard-face back">
          <div className="face-label">Answer</div>
          <div className="face-content">{card.back || 'N/A'}</div>
        </div>
      </div>

      <div className="flashcard-hint">⏱️ Start timer to reveal answer</div>

      <div className="flashcard-controls">
        {!running ? (
          <button onClick={handleStart} className="btn-control btn-start">
            ▶ Start
          </button>
        ) : (
          <button onClick={handleStop} className="btn-control btn-stop">
            ⏹ Stop
          </button>
        )}
        <button 
          onClick={() => {
            setFlipped(false);
            setRunning(false);
            setSecondsLeft(card.timerSeconds || 0);
          }} 
          className="btn-control btn-reset"
        >
          ↻ Reset
        </button>
        <button 
          onClick={() => {
            if (window.confirm('Delete this flashcard?')) {
              deleteFlashcard(card.id);
            }
          }} 
          className="btn-control btn-delete"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}
