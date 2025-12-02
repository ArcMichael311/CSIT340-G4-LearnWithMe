import React, { useState } from 'react';
import './Progress.css';

const Progress = ({ user, onNavigate }) => {
  const [userStats] = useState({
    totalCardsStudied: 342,
    correctAnswers: 287,
    accuracy: 84,
    streak: 2,
    longestStreak: 15,
    totalStudyTime: 1240, // in minutes
    decksCompleted: 8
  });

  const [streakData] = useState({
    currentStreak: 2,
    targetStreak: 7,
    calendar: generateCalendarData()
  });

  function generateCalendarData() {
    const today = new Date();
    const days = [];
    
    // Generate last 42 days (6 weeks)
    for (let i = 41; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Randomly assign study status (for demo purposes)
      const studied = Math.random() > 0.3;
      const questionsAnswered = studied ? Math.floor(Math.random() * 30) + 5 : 0;
      
      days.push({
        date: date.getDate(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        studied: studied,
        questionsAnswered: questionsAnswered,
        isToday: i === 0
      });
    }
    
    return days;
  }

  const accuracyColor = userStats.accuracy >= 80 ? '#48bb78' : userStats.accuracy >= 60 ? '#ed8936' : '#f56565';

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h1>My Progress</h1>
        <p>Track your learning journey and achievements</p>
      </div>


      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-value">{userStats.totalCardsStudied}</div>
          <div className="stat-label">Cards Studied</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-value">{userStats.correctAnswers}</div>
          <div className="stat-label">Correct Answers</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value" style={{ color: accuracyColor }}>
            {userStats.accuracy}%
          </div>
          <div className="stat-label">Accuracy</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{userStats.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{Math.floor(userStats.totalStudyTime / 60)}h {userStats.totalStudyTime % 60}m</div>
          <div className="stat-label">Study Time</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{userStats.decksCompleted}</div>
          <div className="stat-label">Decks Completed</div>
        </div>
      </div>

      {/* Streak Section */}
      <div className="streak-section">
        <div className="streak-header">
          <h2>Start your streak!</h2>
          <div className="streak-counter">
            <div className="streak-icon">🔥</div>
            <div className="streak-info">
              <div className="streak-number">{streakData.currentStreak}</div>
              <div className="streak-text">Questions to start your streak</div>
            </div>
          </div>
        </div>

        <div className="calendar-container">
          <div className="calendar-weekdays">
            <div className="weekday">Sun</div>
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
          </div>

          <div className="calendar-grid">
            {streakData.calendar.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day.studied ? 'studied' : ''} ${day.isToday ? 'today' : ''}`}
                title={`${day.day}, ${day.month} ${day.date}: ${day.questionsAnswered} questions`}
              >
                <span className="day-number">{day.date}</span>
                {day.studied && <div className="study-indicator"></div>}
              </div>
            ))}
          </div>
        </div>

        <button className="start-streak-btn" onClick={() => onNavigate && onNavigate('decks')}>
          <span>🚀</span> Start streak
        </button>
      </div>

      {/* Activity Chart */}
      <div className="activity-section">
        <h2>Study Activity</h2>
        <div className="activity-chart">
          <div className="chart-bars">
            {[65, 82, 45, 90, 73, 88, 95].map((height, index) => (
              <div key={index} className="bar-container">
                <div className="bar" style={{ height: `${height}%` }}>
                  <span className="bar-value">{Math.floor(height * 0.5)}</span>
                </div>
                <div className="bar-label">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          <div className="achievement unlocked">
            <div className="achievement-icon">🎓</div>
            <div className="achievement-name">First Steps</div>
            <div className="achievement-desc">Complete your first deck</div>
        </div>

        <div className="achievement unlocked">
            <div className="achievement-icon">🔥</div>
            <div className="achievement-name">Hot Streak</div>
            <div className="achievement-desc">Study for 7 days in a row</div>
        </div>

        <div className="achievement unlocked">
            <div className="achievement-icon">💯</div>
            <div className="achievement-name">Perfect Score</div>
            <div className="achievement-desc">Get 100% on a deck</div>
        </div>

        <div className="achievement locked">
            <div className="achievement-icon">🌟</div>
            <div className="achievement-name">Level Master</div>
            <div className="achievement-desc">Reach level 20</div>
        </div>

        <div className="achievement locked">
            <div className="achievement-icon">📚</div>
            <div className="achievement-name">Bookworm</div>
            <div className="achievement-desc">Study 1000 cards</div>
        </div>

        <div className="achievement locked">
            <div className="achievement-icon">⚡</div>
            <div className="achievement-name">Lightning Round</div>
            <div className="achievement-desc">Answer 50 cards in 5 minutes</div>
        </div>
        </div>
    </div>
    </div>
);
};

export default Progress;