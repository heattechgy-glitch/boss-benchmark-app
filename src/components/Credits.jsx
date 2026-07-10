import React from 'react';
import './Credits.css';

const Credits = ({ credits, maxCredits }) => {
  const percentage = (credits / maxCredits) * 100;
  const isLowBalance = credits < 10;
  
  return (
    <div 
      className={`credits-container${isLowBalance ? ' low-balance-pulse' : ''}`} 
      style={{ margin: '16px 0' }}
    >
      <div className="credits-header" style={{ marginBottom: '8px' }}>
        <span className="credits-label">Credits</span>
        <span className={`credits-value${isLowBalance ? ' low-balance' : ''}`}>
          {credits} / {maxCredits}
        </span>
      </div>
      <div className="credits-bar-container">
        <div 
          className={`credits-bar-fill${isLowBalance ? ' low-balance' : ''}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="credits-info" style={{ marginTop: '8px', marginBottom: '0' }}>
        Credits refresh daily at midnight UTC
      </p>
    </div>
  );
};

export default Credits;
