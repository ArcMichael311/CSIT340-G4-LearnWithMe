import React, { useState, useEffect } from 'react';
import './Flashcards.css';
import Modal from '../Modal/Modal';

const Flashcards = ({ deck, onBack }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', showCancel: false, onConfirm: null });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newCard, setNewCard] = useState({ 
    front: '', 
    back: '', 
    type: 'multiple-choice',
    timer: 30,
    options: ['', '', '', ''],
    correctAnswerIndex: 0
  });
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [cardAnswerStates, setCardAnswerStates] = useState({}); // Track which cards have shown answers
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);

  const API_BASE_URL = 'http://localhost:8080/api/flashcards';

  // Fetch flashcards for this deck when component mounts
  useEffect(() => {
    if (deck && deck.deckId) {
      fetchFlashcards();
    }
  }, [deck]);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/deck/${deck.deckId}`);
      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match frontend structure
        const transformedData = data.map(card => {
          let options = [];
          
          // Try to parse stored options
          if (card.options) {
            try {
              options = JSON.parse(card.options);
            } catch (e) {
              // If parsing fails, generate random wrong answers
              options = [card.answer, ...generateWrongAnswers(card.answer)].sort(() => Math.random() - 0.5);
            }
          } else {
            // If no options stored, generate random wrong answers
            options = [card.answer, ...generateWrongAnswers(card.answer)].sort(() => Math.random() - 0.5);
          }
          
          return {
            id: card.cardId,
            front: card.question,
            back: card.answer,
            type: 'multiple-choice',
            timer: card.timer || 30, // Use timer from DB or default to 30
            options: options
          };
        });
        setFlashcards(transformedData);
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate random wrong answers for multiple choice
  const generateWrongAnswers = (correctAnswer) => {
    const wrongAnswers = [
      'Option A',
      'Option B', 
      'Option C',
      'Not the correct answer',
      'This is wrong',
      'Incorrect choice',
      'Try again',
      'False',
      'No',
      'Maybe',
      'Unknown',
      'Not applicable'
    ];
    
    // Shuffle and take 3 random wrong answers
    const shuffled = wrongAnswers.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    
    // Validate multiple choice options
    if (newCard.type === 'multiple-choice') {
      const filledOptions = newCard.options.filter(opt => opt.trim() !== '');
      if (filledOptions.length < 2) {
        setModal({ isOpen: true, title: 'Validation Error', message: 'Please provide at least 2 options for multiple choice!', type: 'warning', showCancel: false, onConfirm: null });
        return;
      }
      if (newCard.correctAnswerIndex === null || newCard.correctAnswerIndex === undefined) {
        setModal({ isOpen: true, title: 'Validation Error', message: 'Please select the correct answer!', type: 'warning', showCancel: false, onConfirm: null });
        return;
      }
    }
    
    // Prepare card data for backend
    const correctAnswer = newCard.options[newCard.correctAnswerIndex];
    const filledOptions = newCard.options.filter(opt => opt.trim() !== '');
    const cardToCreate = {
      question: newCard.front,
      answer: correctAnswer,
      deckId: deck.deckId,
      options: JSON.stringify(filledOptions), // Store all options as JSON
      timer: newCard.timer // Include timer value
    };

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardToCreate)
      });

      if (response.ok) {
        const createdCard = await response.json();
        // Transform and add to local state
        const newFlashcard = {
          id: createdCard.cardId,
          front: createdCard.question,
          back: createdCard.answer,
          type: 'multiple-choice',
          timer: newCard.timer,
          options: newCard.options.filter(opt => opt.trim() !== '')
        };
        setFlashcards([...flashcards, newFlashcard]);
        setShowCreateModal(false);
        // Reset form but keep the timer setting
        const currentTimer = newCard.timer;
        setNewCard({ 
          front: '', 
          back: '', 
          type: 'multiple-choice',
          timer: currentTimer, // Preserve user's timer preference
          options: ['', '', '', ''],
          correctAnswerIndex: 0
        });
      } else {
        console.error('Error creating card:', response.statusText);
        setModal({ isOpen: true, title: 'Error', message: 'Failed to create flashcard. Please try again.', type: 'error', showCancel: false, onConfirm: null });
      }
    } catch (error) {
      console.error('Error creating card:', error);
      setModal({ isOpen: true, title: 'Error', message: 'Error creating flashcard: ' + error.message, type: 'error', showCancel: false, onConfirm: null });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id) => {
    setModal({
      isOpen: true,
      title: 'Delete Card',
      message: 'Are you sure you want to delete this card?',
      type: 'warning',
      showCancel: true,
      onConfirm: async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            setFlashcards(flashcards.filter(card => card.id !== id));
          } else {
            console.error('Error deleting card:', response.statusText);
            setModal({ isOpen: true, title: 'Error', message: 'Failed to delete flashcard. Please try again.', type: 'error', showCancel: false, onConfirm: null });
          }
        } catch (error) {
          console.error('Error deleting card:', error);
          setModal({ isOpen: true, title: 'Error', message: 'Error deleting flashcard: ' + error.message, type: 'error', showCancel: false, onConfirm: null });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleEditCard = (card) => {
    setEditingCard({
      id: card.id,
      front: card.front,
      back: card.back,
      type: card.type,
      timer: card.timer,
      options: card.options || ['', '', '', ''],
      correctAnswerIndex: card.options ? card.options.findIndex(opt => opt === card.back) : 0
    });
    setShowEditModal(true);
  };

  const handleUpdateCard = async (e) => {
    e.preventDefault();
    
    // Validate multiple choice options
    if (editingCard.type === 'multiple-choice') {
      const filledOptions = editingCard.options.filter(opt => opt.trim() !== '');
      if (filledOptions.length < 2) {
        setModal({ isOpen: true, title: 'Validation Error', message: 'Please provide at least 2 options for multiple choice!', type: 'warning', showCancel: false, onConfirm: null });
        return;
      }
      if (editingCard.correctAnswerIndex === null || editingCard.correctAnswerIndex === undefined) {
        setModal({ isOpen: true, title: 'Validation Error', message: 'Please select the correct answer!', type: 'warning', showCancel: false, onConfirm: null });
        return;
      }
    }
    
    const correctAnswer = editingCard.options[editingCard.correctAnswerIndex];
    const filledOptions = editingCard.options.filter(opt => opt.trim() !== '');
    const cardToUpdate = {
      cardId: editingCard.id,
      question: editingCard.front,
      answer: correctAnswer,
      deckId: deck.deckId,
      options: JSON.stringify(filledOptions),
      timer: editingCard.timer
    };

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/update/${editingCard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardToUpdate)
      });

      if (response.ok) {
        const updatedCard = await response.json();
        const updatedFlashcard = {
          id: updatedCard.cardId,
          front: updatedCard.question,
          back: updatedCard.answer,
          type: 'multiple-choice',
          timer: editingCard.timer,
          options: editingCard.options.filter(opt => opt.trim() !== '')
        };
        setFlashcards(flashcards.map(c => c.id === editingCard.id ? updatedFlashcard : c));
        setShowEditModal(false);
        setEditingCard(null);
      } else {
        console.error('Error updating card:', response.statusText);
        setModal({ isOpen: true, title: 'Error', message: 'Failed to update flashcard. Please try again.', type: 'error', showCancel: false, onConfirm: null });
      }
    } catch (error) {
      console.error('Error updating card:', error);
      setModal({ isOpen: true, title: 'Error', message: 'Error updating flashcard: ' + error.message, type: 'error', showCancel: false, onConfirm: null });
    } finally {
      setLoading(false);
    }
  };

  const handleStartStudy = () => {
    if (flashcards.length === 0) {
      setModal({ isOpen: true, title: 'No Flashcards', message: 'Add some flashcards first!', type: 'warning', showCancel: false, onConfirm: null });
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
    setCardAnswerStates({}); // Reset all card answer states
    const firstCard = flashcards[0];
    setTimeRemaining(firstCard.timer);
    setTimerActive(true);
  };

  const recordStudySession = async () => {
    try {
      if (deck && deck.deckId && totalAnswered > 0) {
        // Send aggregated deck study session with correct and total answers
        const sessionData = {
          userId: 1, // Placeholder - you may want to get this from auth
          deckId: deck.deckId,
          correctAnswers: score,
          totalAnswers: totalAnswered
        };
        
        console.log('[Flashcards] Sending study session data:', sessionData);
        
        const response = await fetch('http://localhost:8080/api/progress/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionData)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`[Flashcards] Study session recorded - Deck: ${deck.title}, Score: ${score}/${totalAnswered}, Accuracy: ${result.accuracy}%`);
        } else {
          const errorText = await response.text();
          console.error('Failed to record study session:', response.status, errorText);
        }
      }
      
      // Update the onBack callback to refresh deck info with new study status
      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error('Error recording study session:', error);
      // Still navigate back even if recording fails
      if (onBack) {
        onBack();
      }
    }
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
      setShowAnswer(false); // Always hide answer for new card
      setUserAnswer('');
      setSelectedOption(null);
      setIsCorrect(null);
      setHasCheckedAnswer(false);
      // Remove this card's answer state so it shows fresh options
      setCardAnswerStates(prev => {
        const newState = { ...prev };
        delete newState[currentCardIndex + 1];
        return newState;
      });
      setTimeRemaining(nextCard.timer);
      setTimerActive(true);
    } else {
      setStudyMode(false);
      setTimerActive(false);
      const percentage = ((score / flashcards.length) * 100).toFixed(0);
      setModal({
        isOpen: true,
        title: 'Congratulations!',
        message: `Great job! You've completed all cards!\n\nFinal Score: ${score}/${flashcards.length} (${percentage}%)`,
        type: 'success',
        showCancel: false,
        onConfirm: () => recordStudySession()
      });
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      const prevCard = flashcards[currentCardIndex - 1];
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false); // Always hide answer for previous card
      setUserAnswer('');
      setSelectedOption(null);
      setIsCorrect(null);
      setHasCheckedAnswer(false);
      // Remove this card's answer state so it shows fresh options
      setCardAnswerStates(prev => {
        const newState = { ...prev };
        delete newState[currentCardIndex - 1];
        return newState;
      });
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

                {currentCard.type === 'multiple-choice' && (
                  <div className="answer-section-multiple-choice">
                    <div className="answer-label">Correct Answer:</div>
                    <div className="correct-answer-option">
                      <div className="option-text correct-highlight">{currentCard.back}</div>
                      <span className="correct-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '4px', verticalAlign: 'middle'}}>
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        Correct
                      </span>
                    </div>
                  </div>
                )}

                {currentCard.type !== 'multiple-choice' && (
                  <>
                    <div className="answer-label">Correct Answer:</div>
                    <div className="answer-text">{currentCard.back}</div>
                  </>
                )}
                
                {userAnswer && currentCard.type !== 'multiple-choice' && (
                  <div className="user-answer-section">
                    <div className="answer-label">Your Answer:</div>
                    <div className="user-answer-text">{userAnswer}</div>
                  </div>
                )}

                {selectedOption !== null && currentCard.type === 'multiple-choice' && (
                  <div className="user-answer-section">
                    <div className="answer-label">Your Answer:</div>
                    <div className={`user-answer-text ${selectedOption !== null && currentCard.options[selectedOption].trim().toLowerCase() === currentCard.back.trim().toLowerCase() ? 'correct-answer' : 'incorrect-answer'}`}>
                      {currentCard.options[selectedOption]}
                    </div>
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
            <div className="card-actions">
              <button 
                className="edit-card-btn"
                onClick={() => handleEditCard(card)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit
              </button>
              <button 
                className="delete-card-btn"
                onClick={() => handleDeleteCard(card.id)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}

        {flashcards.length === 0 && (
          <div className="empty-cards">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <h3>No flashcards yet</h3>
            <p>Create your first flashcard to start studying!</p>
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

              {newCard.type === 'multiple-choice' && (
                <div className="form-group">
                  <label>Multiple Choice Options</label>
                  <small className="helper-text">Select the radio button to mark the correct answer</small>
                  <div className="options-container">
                    {newCard.options.map((option, index) => (
                      <div key={index} className="option-input-group">
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange({ index, text: e.target.value })}
                          className="option-input"
                        />
                        <label className="radio-wrapper">
                          <input
                            type="radio"
                            name="correct-answer"
                            checked={newCard.correctAnswerIndex === index}
                            onChange={() => setNewCard({ ...newCard, correctAnswerIndex: index })}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
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

      {/* Edit Card Modal */}
      {showEditModal && editingCard && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Flashcard</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateCard}>
              <div className="form-group">
                <label>Front (Question)</label>
                <textarea
                  placeholder="Enter your question"
                  value={editingCard.front}
                  onChange={(e) => setEditingCard({ ...editingCard, front: e.target.value })}
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Timer (seconds)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={editingCard.timer}
                  onChange={(e) => setEditingCard({ ...editingCard, timer: parseInt(e.target.value) })}
                  required
                />
              </div>

              {editingCard.type === 'multiple-choice' && (
                <div className="form-group">
                  <label>Multiple Choice Options</label>
                  <small className="helper-text">Select the radio button to mark the correct answer</small>
                  <div className="options-container">
                    {editingCard.options.map((option, index) => (
                      <div key={index} className="option-input-group">
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...editingCard.options];
                            newOptions[index] = e.target.value;
                            setEditingCard({ ...editingCard, options: newOptions });
                          }}
                          className="option-input"
                        />
                        <label className="radio-wrapper">
                          <input
                            type="radio"
                            name="correct-answer-edit"
                            checked={editingCard.correctAnswerIndex === index}
                            onChange={() => setEditingCard({ ...editingCard, correctAnswerIndex: index })}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="add-option-btn"
                    onClick={() => setEditingCard({ ...editingCard, options: [...editingCard.options, ''] })}
                  >
                    + Add Option
                  </button>
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-create">
                  Update Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        showCancel={modal.showCancel}
      />
    </div>
  );
};

export default Flashcards;