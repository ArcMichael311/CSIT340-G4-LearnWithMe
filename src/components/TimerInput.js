import React from 'react';

export default function TimerInput({ value, onChange, label = 'Timer (seconds)' }) {
  return (
    <div className="timer-input-group">
      <label htmlFor="timer">{label}</label>
      <div className="timer-input-wrapper">
        <button 
          type="button" 
          onClick={() => onChange(Math.max(0, value - 5))}
          className="timer-btn-minus"
        >
          −
        </button>
        <input 
          id="timer"
          type="number" 
          min="0" 
          max="300"
          value={value} 
          onChange={e => onChange(Math.max(0, Number(e.target.value)))}
          className="timer-input-field"
        />
        <button 
          type="button" 
          onClick={() => onChange(Math.min(300, value + 5))}
          className="timer-btn-plus"
        >
          +
        </button>
      </div>
      <span className="timer-display">{value} seconds</span>
    </div>
  );
}
