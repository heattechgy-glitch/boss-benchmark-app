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
    // Apply CSS variables for dark mode
    if (darkMode) {
      document.documentElement.style.setProperty('--background', '#1a1a1a');
      document.documentElement.style.setProperty('--text', '#f0f0f0');
      document.documentElement.style.setProperty('--card-bg', '#2d2d2d');
      document.documentElement.style.setProperty('--border', '#444');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.style.setProperty('--background', '#ffffff');
      document.documentElement.style.setProperty('--text', '#333333');
      document.documentElement.style.setProperty('--card-bg', '#f9f9f9');
      document.documentElement.style.setProperty('--border', '#e0e0e0');
      document.documentElement.setAttribute('data-theme', 'light');
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
          className={`dark-mode-toggle ${darkMode ? 'active' : ''}`}
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={darkMode}
          type="button"
        >
          <span className="toggle-track">
            <span className="toggle-thumb">
              <span className="toggle-icon">{darkMode ? '☀️' : '🌙'}</span>
            </span>
          </span>
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
            type="button"
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
