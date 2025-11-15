import React, { useState, useEffect } from 'react';
import './FlashcardStudy.css';

const FlashcardStudy = ({ flashcardSets, onBackToDashboard }) => {
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState('normal'); // normal, shuffle, review
  const [studyCards, setStudyCards] = useState([]);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (selectedSet) {
      let cards = [...selectedSet.cards];
      
      if (studyMode === 'shuffle') {
        cards = shuffleArray(cards);
      }
      
      setStudyCards(cards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setStudyStats({ correct: 0, incorrect: 0, total: cards.length });
      setShowResults(false);
    }
  }, [selectedSet, studyMode]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleSetSelection = (set) => {
    setSelectedSet(set);
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (isCorrect) => {
    setStudyStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1)
    }));

    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setShowResults(true);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyStats({ correct: 0, incorrect: 0, total: studyCards.length });
    setShowResults(false);
  };

  const handleBackToSets = () => {
    setSelectedSet(null);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowResults(false);
  };

  if (flashcardSets.length === 0) {
    return (
      <div className="study-container">
        <div className="empty-study">
          <div className="empty-icon">📚</div>
          <h3>No flashcard sets available</h3>
          <p>Create some flashcard sets first to start studying!</p>
          <button className="back-btn" onClick={onBackToDashboard}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!selectedSet) {
    return (
      <div className="study-container">
        <div className="study-header">
          <h2>📖 Choose a Set to Study</h2>
          <button className="back-btn" onClick={onBackToDashboard}>
            ← Back to Dashboard
          </button>
        </div>

        <div className="study-modes">
          <div className="mode-selector">
            <label>Study Mode:</label>
            <select 
              value={studyMode} 
              onChange={(e) => setStudyMode(e.target.value)}
            >
              <option value="normal">Normal Order</option>
              <option value="shuffle">Shuffled</option>
            </select>
          </div>
        </div>

        <div className="sets-selection">
          {flashcardSets.map(set => (
            <div 
              key={set.id} 
              className="study-set-card"
              onClick={() => handleSetSelection(set)}
            >
              <h3>{set.title}</h3>
              {set.description && <p>{set.description}</p>}
              <div className="set-meta">
                <span className="card-count">{set.cards.length} cards</span>
                {set.lastStudied && (
                  <span className="last-studied">
                    Last studied: {new Date(set.lastStudied).toLocaleDateString()}
                  </span>
                )}
              </div>
              <button className="select-btn">Start Studying</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showResults) {
    const accuracy = studyStats.total > 0 ? Math.round((studyStats.correct / studyStats.total) * 100) : 0;
    
    return (
      <div className="study-container">
        <div className="results-container">
          <div className="results-header">
            <h2>🎉 Study Session Complete!</h2>
            <p>Great job studying "{selectedSet.title}"</p>
          </div>

          <div className="results-stats">
            <div className="result-stat">
              <div className="stat-number correct">{studyStats.correct}</div>
              <div className="stat-label">Correct</div>
            </div>
            <div className="result-stat">
              <div className="stat-number incorrect">{studyStats.incorrect}</div>
              <div className="stat-label">Incorrect</div>
            </div>
            <div className="result-stat">
              <div className="stat-number accuracy">{accuracy}%</div>
              <div className="stat-label">Accuracy</div>
            </div>
          </div>

          <div className="results-actions">
            <button className="restart-btn" onClick={handleRestart}>
              Study Again
            </button>
            <button className="change-set-btn" onClick={handleBackToSets}>
              Choose Different Set
            </button>
            <button className="dashboard-btn" onClick={onBackToDashboard}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = studyCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / studyCards.length) * 100;

  return (
    <div className="study-container">
      <div className="study-header">
        <div className="study-info">
          <h2>{selectedSet.title}</h2>
          <p>Card {currentCardIndex + 1} of {studyCards.length}</p>
        </div>
        <button className="back-btn" onClick={handleBackToSets}>
          ← Choose Different Set
        </button>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="study-area">
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleCardFlip}>
          <div className="card-front">
            <div className="card-label">Question</div>
            <div className="card-content">{currentCard.front}</div>
            <div className="flip-hint">Click to reveal answer</div>
          </div>
          <div className="card-back">
            <div className="card-label">Answer</div>
            <div className="card-content">{currentCard.back}</div>
            <div className="flip-hint">Click to see question</div>
          </div>
        </div>

        {isFlipped && (
          <div className="answer-buttons">
            <button 
              className="answer-btn incorrect-btn"
              onClick={() => handleAnswer(false)}
            >
              ❌ Incorrect
            </button>
            <button 
              className="answer-btn correct-btn"
              onClick={() => handleAnswer(true)}
            >
              ✅ Correct
            </button>
          </div>
        )}

        <div className="navigation-buttons">
          <button 
            className="nav-btn"
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
          >
            ← Previous
          </button>
          
          <button 
            className="flip-btn"
            onClick={handleCardFlip}
          >
            {isFlipped ? 'Show Question' : 'Show Answer'}
          </button>
          
          <button 
            className="nav-btn"
            onClick={handleNextCard}
            disabled={currentCardIndex === studyCards.length - 1}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="study-progress">
        <div className="progress-stats">
          <span className="correct-count">✅ {studyStats.correct}</span>
          <span className="incorrect-count">❌ {studyStats.incorrect}</span>
        </div>
      </div>
    </div>
  );
};

export default FlashcardStudy;
