import React, { useState, useEffect } from 'react';
import './Progress.css';

const Progress = ({ user, onNavigate }) => {
  const [userStats, setUserStats] = useState({
    totalCardsStudied: 0,
    correctAnswers: 0,
    accuracy: 0,
    decksCompleted: 0
  });
  const [deckScores, setDeckScores] = useState([]);
  const [loading, setLoading] = useState(true);

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
                    <span className="deck-score-stats">{deck.score}/{deck.totalCards} correct</span>
                  </div>
                  <div className="deck-score-percentage">{deck.percentage}%</div>
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
    </div>
  );
};

export default Progress;