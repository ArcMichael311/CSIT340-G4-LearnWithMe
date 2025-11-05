import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../context/DataContext';

export default function StudyMode({ deckId, onBack }) {
  const { data, addProgress } = useContext(DataContext);
  const deck = data.decks.find(d => d.id === deckId);
  const flashcards = data.flashcards.filter(fc => fc.deckId === deckId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  const currentCard = flashcards[currentIndex];

  // Initialize timer when card changes
  useEffect(() => {
    setSecondsLeft(currentCard?.timerSeconds || 0);
    setFlipped(false);
    setRunning(false);
    setTimerStarted(false);
  }, [currentIndex, currentCard]);

  // Timer countdown effect
  useEffect(() => {
    if (!running || !timerStarted || secondsLeft <= 0) {
      if (secondsLeft <= 0 && timerStarted && running) {
        setRunning(false);
        setFlipped(true);
        addProgress({
          userId: 1,
          flashcardId: currentCard?.id,
          correct: true,
          timestamp: Date.now()
        });
      }
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [running, secondsLeft, timerStarted, currentCard, addProgress]);

  if (!deck || flashcards.length === 0) {
    return (
      <div className="study-mode-container">
        <button onClick={onBack} className="btn-back">← Back</button>
        <div className="empty-state">No flashcards in this deck to study.</div>
      </div>
    );
  }

  const handleStart = () => {
    setRunning(true);
    setTimerStarted(true);
    setSecondsLeft(currentCard?.timerSeconds || 0);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Study complete
      alert(`Great job! You completed all ${flashcards.length} cards in "${deck.title}"`);
      onBack();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setRunning(false);
    setFlipped(false);
    setTimerStarted(false);
    setSecondsLeft(0);
  };

  const timerColor = secondsLeft > 10 ? '#4ade80' : secondsLeft > 0 ? '#fbbf24' : '#ef4444';
  const isComplete = flipped && !running;

  return (
    <div className="study-mode-container">
      {/* Header */}
      <div className="study-header">
        <button onClick={onBack} className="btn-back">← Back to {deck.title}</button>
        <div className="study-progress">
          <span>Card {currentIndex + 1} of {flashcards.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Study Card */}
      <div className="study-card-container">
        <div className={`study-card ${flipped ? 'flipped' : ''}`}>
          <div className="study-card-face front">
            <div className="face-label">Question</div>
            <div className="face-content">{currentCard?.front || 'N/A'}</div>
          </div>
          <div className="study-card-face back">
            <div className="face-label">Answer</div>
            <div className="face-content">{currentCard?.back || 'N/A'}</div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="timer-display-large">
          <span style={{ color: timerColor }}>{secondsLeft}s</span>
        </div>

        {/* Study Controls */}
        <div className="study-controls">
          {!timerStarted ? (
            <button onClick={handleStart} className="btn-study btn-start-study">
              ▶ Start Timer
            </button>
          ) : !isComplete ? (
            <>
              {running ? (
                <button onClick={() => setRunning(false)} className="btn-study btn-pause-study">
                  ⏸ Pause Timer
                </button>
              ) : (
                <button onClick={() => setRunning(true)} className="btn-study btn-resume-study">
                  ▶ Resume Timer
                </button>
              )}
            </>
          ) : null}

          {isComplete && (
            <div className="study-actions">
              <button onClick={handleRestart} className="btn-study btn-restart-study">
                ↻ Restart Deck
              </button>
              <button onClick={handleNext} className="btn-study btn-next">
                ➜ Next Card
              </button>
            </div>
          )}
        </div>

        {/* Status Message */}
        {isComplete && (
          <div className="study-message">
            ✓ Answer revealed! Press "Next Card" to continue.
          </div>
        )}
      </div>
    </div>
  );
}
