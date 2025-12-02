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
              🏆 Score: {score}/{flashcards.length}
            </div>
            <div className="progress-info">
              Card {currentCardIndex + 1} of {flashcards.length}
            </div>
            <div className={`timer ${timeRemaining <= 5 ? 'urgent' : ''}`}>
              ⏱️ {timeRemaining}s
            </div>
          </div>
        </div>

        <div className="study-container">
          <div className="question-card">
            <div className="card-type-badge">
              {currentCard.type === 'multiple-choice' && '📝 Multiple Choice'}
              {currentCard.type === 'fill-blank' && '✍️ Fill in the Blank'}
              {currentCard.type === 'short-answer' && '💬 Short Answer'}
              {currentCard.type === 'long-answer' && '📄 Long Answer'}
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
                  ✓ Check Answer
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
                        <span className="result-icon">✓</span>
                        <span className="result-text">Correct! +1 point</span>
                      </>
                    ) : (
                      <>
                        <span className="result-icon">✗</span>
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
                ✓ Check Answer
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
            <div className="card-type-indicator">
              {card.type === 'multiple-choice' && '📝 Multiple Choice'}
              {card.type === 'fill-blank' && '✍️ Fill in the Blank'}
              {card.type === 'short-answer' && '💬 Short Answer'}
              {card.type === 'long-answer' && '📄 Long Answer'}
            </div>
            <div className="card-timer-indicator">⏱️ {card.timer}s</div>
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