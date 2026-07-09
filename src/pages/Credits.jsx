import React from 'react';
import './Credits.css';

const Credits = () => {
  const contributors = [
    { name: 'John Doe', role: 'Lead Developer' },
    { name: 'Jane Smith', role: 'UI/UX Designer' },
    { name: 'Bob Johnson', role: 'Backend Engineer' },
    { name: 'Alice Williams', role: 'QA Engineer' }
  ];

  return (
    <div className="credits-container">
      <h1 className="credits-title">Credits</h1>
      <p className="credits-description">
        This project was made possible by the following contributors:
      </p>
      <div className="contributors-list">
        {contributors.map((contributor, index) => (
          <div key={index} className="contributor-card">
            <h3 className="contributor-name">{contributor.name}</h3>
            <p className="contributor-role">{contributor.role}</p>
          </div>
        ))}
      </div>
      <footer className="credits-footer">
        <p>Thank you for using BOSS Benchmark App!</p>
      </footer>
    </div>
  );
};

export default Credits;
