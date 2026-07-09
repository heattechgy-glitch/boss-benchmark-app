import React, { useState, useEffect } from 'react';
import './VibePicker.css';

const VibePicker = ({ onVibeSelect, selectedVibe }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const vibes = [
    { id: 'chill', label: 'Chill', emoji: '😌', color: '#7EC8E3' },
    { id: 'energetic', label: 'Energetic', emoji: '⚡', color: '#FFD700' },
    { id: 'focused', label: 'Focused', emoji: '🎯', color: '#9370DB' },
    { id: 'creative', label: 'Creative', emoji: '🎨', color: '#FF6B6B' },
    { id: 'social', label: 'Social', emoji: '🎉', color: '#98D8C8' },
  ];

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleVibeClick = (vibeId) => {
    if (onVibeSelect) {
      onVibeSelect(vibeId);
    }
  };

  return (
    <div className={`vibe-picker ${darkMode ? 'dark' : 'light'}`}>
      <div className="vibe-picker-header">
        <h2>Pick Your Vibe</h2>
        <button
          className="dark-mode-toggle"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="toggle-icon">{darkMode ? '☀️' : '🌙'}</span>
          <span className="toggle-text">{darkMode ? 'Light' : 'Dark'}</span>
        </button>
      </div>
      <div className="vibe-options">
        {vibes.map((vibe) => (
          <button
            key={vibe.id}
            className={`vibe-option ${selectedVibe === vibe.id ? 'selected' : ''}`}
            onClick={() => handleVibeClick(vibe.id)}
            style={{
              '--vibe-color': vibe.color,
            }}
          >
            <span className="vibe-emoji">{vibe.emoji}</span>
            <span className="vibe-label">{vibe.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VibePicker;
