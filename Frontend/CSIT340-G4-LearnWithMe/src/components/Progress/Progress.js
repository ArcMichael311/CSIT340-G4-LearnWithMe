import React, { useState, useEffect } from 'react';
import './Progress.css';
import Modal from '../Modal/Modal';

const Progress = ({ user, onNavigate }) => {
  const [userStats, setUserStats] = useState({
    totalCardsStudied: 0,
    correctAnswers: 0,
    accuracy: 0,
    decksCompleted: 0
  });
  const [deckScores, setDeckScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedDeckHistory, setSelectedDeckHistory] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetchUserStats();
    // Refresh stats every 5 seconds to show real-time updates
    const interval = setInterval(fetchUserStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      // Fetch all decks
      const decksResponse = await fetch('http://localhost:8080/api/decks');
      const decksData = await decksResponse.ok ? await decksResponse.json() : [];
      
      // Calculate overall stats by summing all deck progress
      let totalCorrect = 0;
      let totalAnswered = 0;
      let decksWithProgress = 0;

      // Fetch progress for each deck
      const deckScoresData = await Promise.all(
        decksData.map(async (deck) => {
          try {
            // Fetch progress data for this deck
            const progressResponse = await fetch(`http://localhost:8080/api/progress/deck/${deck.deckId}/score`);
            const progressData = await progressResponse.ok ? await progressResponse.json() : null;
            
            console.log(`[Progress] Deck: ${deck.title}, Progress:`, progressData);
            
            if (progressData && progressData.total > 0) {
              // Has real progress data from studying
              totalCorrect += progressData.correct;
              totalAnswered += progressData.total;
              decksWithProgress++;
              
              return {
                id: deck.deckId,
                name: deck.title,
                score: progressData.correct,
                totalCards: progressData.total,
                percentage: progressData.percentage,
                retakes: progressData.retakes || 0,
                hasProgress: true
              };
            } else {
              // No progress data yet - show 0%
              return {
                id: deck.deckId,
                name: deck.title,
                score: 0,
                totalCards: 0,
                percentage: 0,
                retakes: 0,
                hasProgress: false
              };
            }
          } catch (error) {
            console.error(`Error fetching progress for deck ${deck.deckId}:`, error);
            return {
              id: deck.deckId,
              name: deck.title,
              score: 0,
              totalCards: 0,
              percentage: 0,
              retakes: 0,
              hasProgress: false
            };
          }
        })
      );

      // Calculate overall accuracy from all studied decks
      const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

      console.log(`[Progress] Overall - Cards Studied: ${totalAnswered}, Correct: ${totalCorrect}, Accuracy: ${overallAccuracy}%, Decks with Progress: ${decksWithProgress}`);

      setUserStats({
        totalCardsStudied: totalAnswered,
        correctAnswers: totalCorrect,
        accuracy: overallAccuracy,
        decksCompleted: decksWithProgress
      });

      setDeckScores(deckScoresData);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setUserStats({
        totalCardsStudied: 0,
        correctAnswers: 0,
        accuracy: 0,
        decksCompleted: 0
      });
      setDeckScores([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeckHistory = async (deckId, deckName) => {
    try {
      const response = await fetch(`http://localhost:8080/api/progress/deck/${deckId}/history`);
      if (response.ok) {
        const history = await response.json();
        setHistoryData(history);
        setSelectedDeckHistory(deckName);
        setShowHistoryModal(true);
      } else {
        console.error('Failed to fetch deck history');
      }
    } catch (error) {
      console.error('Error fetching deck history:', error);
    }
  };

  const accuracyColor = userStats.accuracy >= 80 ? '#48bb78' : userStats.accuracy >= 60 ? '#ed8936' : '#f56565';

  if (loading) {
    return (
      <div className="progress-container">
        <div className="progress-header">
          <h1>My Progress</h1>
          <p>Loading your stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h1>My Progress</h1>
        <p>Track your learning journey and achievements</p>
      </div>


      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          <div className="stat-value">{userStats.totalCardsStudied}</div>
          <div className="stat-label">Cards Studied</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div className="stat-value">{userStats.correctAnswers}</div>
          <div className="stat-label">Correct Answers</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <div className="stat-value" style={{ color: accuracyColor }}>
            {userStats.accuracy}%
          </div>
          <div className="stat-label">Accuracy</div>
        </div>



        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
            </svg>
          </div>
          <div className="stat-value">{userStats.decksCompleted}</div>
          <div className="stat-label">Decks Completed</div>
        </div>
      </div>

      {/* Deck Scores Section */}
      {deckScores.length > 0 && (
        <div className="deck-scores-section">
          <h2>Your Deck Performance</h2>
          <div className="deck-scores-list">
            {deckScores.map((deck) => (
              <div key={deck.id} className="deck-score-item">
                <div className="deck-score-header">
                  <div className="deck-score-info">
                    <h3>{deck.name}</h3>
                    <span className="deck-score-stats">
                      {deck.score}/{deck.totalCards} correct • {deck.retakes} retake{deck.retakes !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="deck-score-actions">
                    <div className="deck-score-percentage">{deck.percentage}%</div>
                    {deck.retakes > 0 && (
                      <button 
                        className="history-btn"
                        onClick={() => fetchDeckHistory(deck.id, deck.name)}
                        title="View study history"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                        </svg>
                        History
                      </button>
                    )}
                  </div>
                </div>
                <div className="deck-progress-bar">
                  <div 
                    className="deck-progress-fill" 
                    style={{ 
                      width: `${deck.percentage}%`,
                      backgroundColor: deck.percentage >= 80 ? '#48bb78' : deck.percentage >= 60 ? '#ed8936' : '#f56565'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="modal history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Study History: {selectedDeckHistory}</h2>
              <button className="modal-close" onClick={() => setShowHistoryModal(false)}>
                ×
              </button>
            </div>
            <div className="history-content">
              {historyData.length === 0 ? (
                <p className="no-history">No study sessions recorded yet.</p>
              ) : (
                <div className="history-list">
                  <div className="history-header-row">
                    <span>Session</span>
                    <span>Score</span>
                    <span>Accuracy</span>
                    <span>Date</span>
                  </div>
                  {historyData.map((session) => (
                    <div key={session.progressId} className="history-item">
                      <span className="session-number">#{session.sessionNumber}</span>
                      <span className="session-score">
                        {session.correctAnswers}/{session.totalAnswers}
                      </span>
                      <span 
                        className="session-accuracy"
                        style={{
                          color: session.accuracy >= 80 ? '#48bb78' : session.accuracy >= 60 ? '#ed8936' : '#f56565'
                        }}
                      >
                        {session.accuracy}%
                      </span>
                      <span className="session-date">
                        {new Date(session.studyDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;