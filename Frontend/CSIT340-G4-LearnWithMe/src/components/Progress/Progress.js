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
              <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
            </svg>
          </div>
          <div className="stat-value">{userStats.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
            </svg>
          </div>
          <div className="stat-value">{Math.floor(userStats.totalStudyTime / 60)}h {userStats.totalStudyTime % 60}m</div>
          <div className="stat-label">Study Time</div>
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

      {/* Streak Section */}
      <div className="streak-section">
        <div className="streak-header">
          <h2>Start your streak!</h2>
          <div className="streak-counter">
            <div className="streak-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
              </svg>
            </div>
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
            <div className="achievement-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              </svg>
            </div>
            <div className="achievement-name">First Steps</div>
            <div className="achievement-desc">Complete your first deck</div>
        </div>

        <div className="achievement unlocked">
            <div className="achievement-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
              </svg>
            </div>
            <div className="achievement-name">Hot Streak</div>
            <div className="achievement-desc">Study for 7 days in a row</div>
        </div>

        <div className="achievement unlocked">
            <div className="achievement-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="achievement-name">Perfect Score</div>
            <div className="achievement-desc">Get 100% on a deck</div>
        </div>

        <div className="achievement locked">
            <div className="achievement-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
            <div className="achievement-name">Level Master</div>
            <div className="achievement-desc">Reach level 20</div>
        </div>

        <div className="achievement locked">
            <div className="achievement-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <div className="achievement-name">Bookworm</div>
            <div className="achievement-desc">Study 1000 cards</div>
        </div>

        <div className="achievement locked">
            <div className="achievement-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
              </svg>
            </div>
            <div className="achievement-name">Lightning Round</div>
            <div className="achievement-desc">Answer 50 cards in 5 minutes</div>
        </div>
        </div>
    </div>
    </div>
);
};

export default Progress;