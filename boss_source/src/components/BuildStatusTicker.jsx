import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './BuildStatusTicker.css';

const BuildStatusTicker = ({ builds = [], refreshInterval = 30000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (builds.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % builds.length);
        setIsAnimating(false);
      }, 300);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [builds.length, refreshInterval]);

  const calculateOverallCompletion = () => {
    if (!builds || builds.length === 0) return 0;
    
    const totalCompletion = builds.reduce((sum, build) => {
      if (build.status === 'completed' || build.status === 'success') {
        return sum + 100;
      } else if (build.status === 'failed' || build.status === 'error') {
        return sum + 100;
      } else if (build.status === 'in_progress' || build.status === 'running') {
        return sum + (build.progress || 50);
      } else if (build.status === 'pending' || build.status === 'queued') {
        return sum + 0;
      }
      return sum + (build.progress || 0);
    }, 0);
    
    return Math.round(totalCompletion / builds.length);
  };

  const getStatusColor = (status) => {
    const colors = {
      success: '#28a745',
      completed: '#28a745',
      failed: '#dc3545',
      error: '#dc3545',
      in_progress: '#ffc107',
      running: '#ffc107',
      pending: '#6c757d',
      queued: '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 50) return '#ffc107';
    if (percentage >= 25) return '#fd7e14';
    return '#dc3545';
  };

  const overallCompletion = calculateOverallCompletion();
  const currentBuild = builds[currentIndex];

  if (!builds || builds.length === 0) {
    return (
      <div className="build-status-ticker">
        <div className="ticker-empty">No builds available</div>
      </div>
    );
  }

  return (
    <div className="build-status-ticker">
      <div className="overall-progress-container">
        <div className="overall-progress-header">
          <span className="progress-label">Overall Project Completion</span>
          <span className="progress-percentage">{overallCompletion}%</span>
        </div>
        <div className="overall-progress-bar">
          <div
            className="overall-progress-fill"
            style={{
              width: `${overallCompletion}%`,
              backgroundColor: getProgressBarColor(overallCompletion)
            }}
          />
        </div>
        <div className="progress-stats">
          <span className="stat-item">
            {builds.filter(b => b.status === 'completed' || b.status === 'success').length} completed
          </span>
          <span className="stat-item">
            {builds.filter(b => b.status === 'in_progress' || b.status === 'running').length} in progress
          </span>
          <span className="stat-item">
            {builds.filter(b => b.status === 'failed' || b.status === 'error').length} failed
          </span>
        </div>
      </div>

      <div className="ticker-divider" />

      <div className={`ticker-content ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        <div className="ticker-header">
          <span className="ticker-title">Build Status</span>
          <span className="ticker-count">
            {currentIndex + 1} / {builds.length}
          </span>
        </div>
        
        {currentBuild && (
          <div className="ticker-build">
            <div className="build-info">
              <span className="build-name">{currentBuild.name || currentBuild.id}</span>
              <span 
                className="build-status"
                style={{ color: getStatusColor(currentBuild.status) }}
              >
                {currentBuild.status}
              </span>
            </div>
            {currentBuild.message && (
              <div className="build-message">{currentBuild.message}</div>
            )}
            {currentBuild.timestamp && (
              <div className="build-timestamp">
                {new Date(currentBuild.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ticker-indicators">
        {builds.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

BuildStatusTicker.propTypes = {
  builds: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      status: PropTypes.string,
      progress: PropTypes.number,
      message: PropTypes.string,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)])
    })
  ),
  refreshInterval: PropTypes.number
};

export default BuildStatusTicker;
