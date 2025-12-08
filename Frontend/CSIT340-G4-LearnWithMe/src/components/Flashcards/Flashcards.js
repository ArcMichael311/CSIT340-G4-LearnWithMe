import React, { useState } from 'react';
import './Flashcards.css';

const Flashcards = ({ deck, onBack }) => {
  const [flashcards, setFlashcards] = useState([
    {
      id: 1,
      front: 'What is photosynthesis?',
      back: 'The process by which plants use sunlight, water and carbon dioxide to produce oxygen and energy in the form of sugar.',
      type: 'short-answer',
      timer: 30,
      options: []
    },
    {
      id: 2,
      front: '¿Cómo estás?',
      back: 'How are you? (Spanish)',
      type: 'fill-blank',
      timer: 15,
      options: []
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCard, setNewCard] = useState({ 
    front: '', 
    back: '', 
    type: 'multiple-choice',
    timer: 30,
    options: ['', '', '', '']
  });
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);

  const handleCreateCard = (e) => {
    e.preventDefault();
    
    // Validate multiple choice options
    if (newCard.type === 'multiple-choice') {
      const filledOptions = newCard.options.filter(opt => opt.trim() !== '');
      if (filledOptions.length < 2) {
        alert('Please provide at least 2 options for multiple choice!');
        return;
      }
    }
    
    const card = {
      id: Date.now(),
      ...newCard,
      options: newCard.type === 'multiple-choice' ? newCard.options.filter(opt => opt.trim() !== '') : []
    };
    setFlashcards([...flashcards, card]);
    setShowCreateModal(false);
    setNewCard({ 
      front: '', 
      back: '', 
      type: 'multiple-choice',
      timer: 30,
      options: ['', '', '', '']
    });
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
    setShowAnswer(false);
    setUserAnswer('');
    setSelectedOption(null);
    setScore(0);
    setTotalAnswered(0);
    setIsCorrect(null);
    setHasCheckedAnswer(false);
    const firstCard = flashcards[0];
    setTimeRemaining(firstCard.timer);
    setTimerActive(true);
  };

  // Timer effect
  React.useEffect(() => {
    if (!timerActive || timeRemaining <= 0) {
      if (timeRemaining === 0 && studyMode && !showAnswer) {
        setShowAnswer(true);
        setTimerActive(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          setShowAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, studyMode, showAnswer]);

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      const nextCard = flashcards[currentCardIndex + 1];
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
      setUserAnswer('');
      setSelectedOption(null);
      setIsCorrect(null);
      setHasCheckedAnswer(false);
      setTimeRemaining(nextCard.timer);
      setTimerActive(true);
    } else {
      setStudyMode(false);
      setTimerActive(false);
      const percentage = ((score / flashcards.length) * 100).toFixed(0);
      alert(`Great job! You've completed all cards!\n\nFinal Score: ${score}/${flashcards.length} (${percentage}%)`);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      const prevCard = flashcards[currentCardIndex - 1];
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
      setUserAnswer('');
      setSelectedOption(null);
      setIsCorrect(null);
      setHasCheckedAnswer(false);
      setTimeRemaining(prevCard.timer);
      setTimerActive(true);
    }
  };

  const handleCheckAnswer = () => {
    const currentCard = flashcards[currentCardIndex];
    let correct = false;

    if (currentCard.type === 'multiple-choice') {
      if (selectedOption !== null) {
        const selectedAnswer = currentCard.options[selectedOption].trim().toLowerCase();
        const correctAnswer = currentCard.back.trim().toLowerCase();
        correct = selectedAnswer === correctAnswer;
      }
    } else {
      // For fill-blank, short-answer, and long-answer
      const userAnswerTrimmed = userAnswer.trim().toLowerCase();
      const correctAnswerTrimmed = currentCard.back.trim().toLowerCase();
      correct = userAnswerTrimmed === correctAnswerTrimmed;
    }

    setIsCorrect(correct);
    setHasCheckedAnswer(true);
    setShowAnswer(true);
    setTimerActive(false);

    if (correct) {
      setScore(score + 1);
    }
    setTotalAnswered(totalAnswered + 1);
  };

  const handleShowAnswer = () => {
    if (!hasCheckedAnswer) {
      setIsCorrect(false);
      setTotalAnswered(totalAnswered + 1);
    }
    setShowAnswer(true);
    setTimerActive(false);
  };

  const handleOptionChange = (value) => {
    setNewCard({
      ...newCard,
      options: newCard.options.map((opt, i) => i === value.index ? value.text : opt)
    });
  };

  // Study Mode View
  if (studyMode) {
    const currentCard = flashcards[currentCardIndex];
    
    return (
      <div className="study-mode">
        <div className="study-header">
          <button className="back-btn" onClick={() => {
            setStudyMode(false);
            setTimerActive(false);
          }}>
            ← Exit Study Mode
          </button>
          <div className="header-info">
            <div className="score-display">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
              </svg>
              Score: {score}/{flashcards.length}
            </div>
            <div className="progress-info">
              Card {currentCardIndex + 1} of {flashcards.length}
            </div>
            <div className={`timer ${timeRemaining <= 5 ? 'urgent' : ''}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
              </svg>
              {timeRemaining}s
            </div>
          </div>
        </div>

        <div className="study-container">
          <div className="question-card">
            <div className="card-type-badge">
              {currentCard.type === 'multiple-choice' && (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  Multiple Choice
                </>
              )}
              {currentCard.type === 'fill-blank' && (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                    <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>
                  </svg>
                  Fill in the Blank
                </>
              )}
              {currentCard.type === 'short-answer' && (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                  </svg>
                  Short Answer
                </>
              )}
              {currentCard.type === 'long-answer' && (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  Long Answer
                </>
              )}
            </div>

            <div className="question-text">{currentCard.front}</div>

            {!showAnswer && (
              <div className="answer-input-section">
                {currentCard.type === 'multiple-choice' && (
                  <div className="multiple-choice-options">
                    {currentCard.options.map((option, index) => (
                      <label key={index} className="option-label">
                        <input
                          type="radio"
                          name="answer"
                          value={option}
                          checked={selectedOption === index}
                          onChange={() => setSelectedOption(index)}
                        />
                        <span className="option-text">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentCard.type === 'fill-blank' && (
                  <input
                    type="text"
                    className="answer-input"
                    placeholder="Type your answer..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                )}

                {currentCard.type === 'short-answer' && (
                  <textarea
                    className="answer-textarea short"
                    placeholder="Type your answer..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    rows="3"
                  />
                )}

                {currentCard.type === 'long-answer' && (
                  <textarea
                    className="answer-textarea long"
                    placeholder="Type your answer..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    rows="6"
                  />
                )}

                <button 
                  className="check-answer-btn"
                  onClick={handleCheckAnswer}
                  disabled={
                    (currentCard.type === 'multiple-choice' && selectedOption === null) ||
                    (currentCard.type !== 'multiple-choice' && !userAnswer.trim())
                  }
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Check Answer
                </button>

                <button 
                  className="reveal-btn"
                  onClick={handleShowAnswer}
                >
                  Show Answer
                </button>
              </div>
            )}

            {showAnswer && (
              <div className="answer-section">
                {isCorrect !== null && (
                  <div className={`result-banner ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? (
                      <>
                        <span className="result-icon">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </span>
                        <span className="result-text">Correct! +1 point</span>
                      </>
                    ) : (
                      <>
                        <span className="result-icon">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        </span>
                        <span className="result-text">Incorrect</span>
                      </>
                    )}
                  </div>
                )}

                <div className="answer-label">Correct Answer:</div>
                <div className="answer-text">{currentCard.back}</div>
                
                {userAnswer && currentCard.type !== 'multiple-choice' && (
                  <div className="user-answer-section">
                    <div className="answer-label">Your Answer:</div>
                    <div className="user-answer-text">{userAnswer}</div>
                  </div>
                )}

                {selectedOption !== null && currentCard.type === 'multiple-choice' && (
                  <div className="user-answer-section">
                    <div className="answer-label">Your Answer:</div>
                    <div className="user-answer-text">{currentCard.options[selectedOption]}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="study-controls">
            <button 
              className="control-btn"
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
            >
              ← Previous
            </button>
            
            {!showAnswer ? (
              <button 
                className="control-btn check-btn"
                onClick={handleCheckAnswer}
                disabled={
                  (currentCard.type === 'multiple-choice' && selectedOption === null) ||
                  (currentCard.type !== 'multiple-choice' && !userAnswer.trim())
                }
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Check Answer
              </button>
            ) : (
              <button 
                className="control-btn show-answer-btn"
                onClick={handleShowAnswer}
                disabled
              >
                Answer Revealed
              </button>
            )}
            
            <button 
              className="control-btn next-btn"
              onClick={handleNextCard}
              disabled={!showAnswer}
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
            <span>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </span>
            Study Mode
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
            <div className="card-type-indicator">
              {card.type === 'multiple-choice' && (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{marginRight: '4px', verticalAlign: 'middle'}}>
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  Multiple Choice
                </>
              )}
              {card.type === 'fill-blank' && (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{marginRight: '4px', verticalAlign: 'middle'}}>
                    <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>
                  </svg>
                  Fill in the Blank
                </>
              )}
              {card.type === 'short-answer' && (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{marginRight: '4px', verticalAlign: 'middle'}}>
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                  </svg>
                  Short Answer
                </>
              )}
              {card.type === 'long-answer' && (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{marginRight: '4px', verticalAlign: 'middle'}}>
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  Long Answer
                </>
              )}
            </div>
            <div className="card-timer-indicator">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{marginRight: '4px', verticalAlign: 'middle'}}>
                <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
              </svg>
              {card.timer}s
            </div>
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
                <label>Question Type</label>
                <select
                  className="type-select"
                  value={newCard.type}
                  onChange={(e) => setNewCard({ ...newCard, type: e.target.value })}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="fill-blank">Fill in the Blank</option>
                  <option value="short-answer">Short Answer</option>
                  <option value="long-answer">Long Answer</option>
                </select>
              </div>

              <div className="form-group">
                <label>Timer (seconds)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={newCard.timer}
                  onChange={(e) => setNewCard({ ...newCard, timer: parseInt(e.target.value) || 30 })}
                  placeholder="30"
                />
                <small className="helper-text">How long before the answer is revealed (5-300 seconds)</small>
              </div>

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
                <label>Back (Correct Answer)</label>
                <textarea
                  placeholder="Enter the correct answer..."
                  value={newCard.back}
                  onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  rows="4"
                  required
                />
              </div>

              {newCard.type === 'multiple-choice' && (
                <div className="form-group">
                  <label>Multiple Choice Options</label>
                  <small className="helper-text">Include the correct answer as one of the options</small>
                  {newCard.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange({ index, text: e.target.value })}
                      className="option-input"
                    />
                  ))}
                  <button
                    type="button"
                    className="add-option-btn"
                    onClick={() => setNewCard({ ...newCard, options: [...newCard.options, ''] })}
                  >
                    + Add Option
                  </button>
                </div>
              )}

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