import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;
const BACKOFF_MULTIPLIER = 1.5;

const BuildStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILED: 'failed',
  RETRYING: 'retrying',
  CANCELLED: 'cancelled'
};

const BuildMonitor = ({ buildId, onBuildComplete, onError, apiEndpoint = '/api/builds' }) => {
  const [buildSteps, setBuildSteps] = useState([]);
  const [overallStatus, setOverallStatus] = useState(BuildStatus.PENDING);
  const [retryAttempts, setRetryAttempts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuildStatus = useCallback(async () => {
    try {
      const response = await fetch(`${apiEndpoint}/${buildId}/status`);
      if (!response.ok) {
        throw new Error(`Failed to fetch build status: ${response.statusText}`);
      }
      const data = await response.json();
      setBuildSteps(data.steps || []);
      setOverallStatus(data.status || BuildStatus.PENDING);
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      if (onError) {
        onError(err);
      }
      throw err;
    }
  }, [buildId, apiEndpoint, onError]);

  const calculateRetryDelay = useCallback((attemptNumber) => {
    return RETRY_DELAY_MS * Math.pow(BACKOFF_MULTIPLIER, attemptNumber - 1);
  }, []);

  const retryStep = useCallback(async (stepId) => {
    const currentAttempts = retryAttempts[stepId] || 0;
    
    if (currentAttempts >= MAX_RETRY_ATTEMPTS) {
      const errorMsg = `Step ${stepId} exceeded maximum retry attempts (${MAX_RETRY_ATTEMPTS})`;
      setError(errorMsg);
      if (onError) {
        onError(new Error(errorMsg));
      }
      return false;
    }

    const newAttempts = currentAttempts + 1;
    setRetryAttempts(prev => ({
      ...prev,
      [stepId]: newAttempts
    }));

    setBuildSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: BuildStatus.RETRYING, retryCount: newAttempts }
        : step
    ));

    const delay = calculateRetryDelay(newAttempts);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      const response = await fetch(`${apiEndpoint}/${buildId}/steps/${stepId}/retry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attemptNumber: newAttempts,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Retry request failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      setBuildSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, status: result.status, retryCount: newAttempts, lastRetryAt: new Date().toISOString() }
          : step
      ));

      if (result.status === BuildStatus.FAILED && newAttempts < MAX_RETRY_ATTEMPTS) {
        return retryStep(stepId);
      }

      return result.status === BuildStatus.SUCCESS;
    } catch (err) {
      setBuildSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, status: BuildStatus.FAILED, error: err.message }
          : step
      ));

      if (newAttempts < MAX_RETRY_ATTEMPTS) {
        return retryStep(stepId);
      }

      if (onError) {
        onError(err);
      }
      return false;
    }
  }, [buildId, apiEndpoint, retryAttempts, calculateRetryDelay, onError]);

  const retryFailedSteps = useCallback(async () => {
    const failedSteps = buildSteps.filter(step => step.status === BuildStatus.FAILED);
    
    if (failedSteps.length === 0) {
      return true;
    }

    setOverallStatus(BuildStatus.RETRYING);

    const retryResults = await Promise.all(
      failedSteps.map(step => retryStep(step.id))
    );

    const allSuccessful = retryResults.every(result => result === true);
    
    if (allSuccessful) {
      setOverallStatus(BuildStatus.SUCCESS);
      if (onBuildComplete) {
        onBuildComplete({ buildId, status: BuildStatus.SUCCESS });
      }
    } else {
      setOverallStatus(BuildStatus.FAILED);
      if (onBuildComplete) {
        onBuildComplete({ buildId, status: BuildStatus.FAILED });
      }
    }

    return allSuccessful;
  }, [buildSteps, retryStep, buildId, onBuildComplete]);

  const cancelRetry = useCallback((stepId) => {
    setBuildSteps(prev => prev.map(step => 
      step.id === stepId && step.status === BuildStatus.RETRYING
        ? { ...step, status: BuildStatus.CANCELLED }
        : step
    ));
    setRetryAttempts(prev => ({
      ...prev,
      [stepId]: MAX_RETRY_ATTEMPTS
    }));
  }, []);

  const resetRetryAttempts = useCallback((stepId) => {
    if (stepId) {
      setRetryAttempts(prev => {
        const newAttempts = { ...prev };
        delete newAttempts[stepId];
        return newAttempts;
      });
    } else {
      setRetryAttempts({});
    }
  }, []);

  useEffect(() => {
    if (buildId) {
      fetchBuildStatus();
    }
  }, [buildId, fetchBuildStatus]);

  useEffect(() => {
    if (overallStatus === BuildStatus.RUNNING || overallStatus === BuildStatus.RETRYING) {
      const pollInterval = setInterval(() => {
        fetchBuildStatus();
      }, 5000);

      return () => clearInterval(pollInterval);
    }
  }, [overallStatus, fetchBuildStatus]);

  const getStatusIcon = (status) => {
    switch (status) {
      case BuildStatus.SUCCESS:
        return '✓';
      case BuildStatus.FAILED:
        return '✗';
      case BuildStatus.RUNNING:
        return '⟳';
      case BuildStatus.RETRYING:
        return '↻';
      case BuildStatus.CANCELLED:
        return '⊘';
      default:
        return '○';
    }
  };

  const getStatusClass = (status) => {
    return `build-step-status build-step-status--${status}`;
  };

  if (isLoading) {
    return (
      <div className="build-monitor build-monitor--loading">
        <div className="build-monitor__spinner" aria-label="Loading build status">
          Loading...
        </div>
      </div>
    );
  }

  if (error && buildSteps.length === 0) {
    return (
      <div className="build-monitor build-monitor--error">
        <div className="build-monitor__error-message">
          <span className="error-icon">⚠</span>
          <span>{error}</span>
        </div>
        <button 
          className="build-monitor__retry-button"
          onClick={() => {
            setError(null);
            fetchBuildStatus();
          }}
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const failedStepsCount = buildSteps.filter(step => step.status === BuildStatus.FAILED).length;

  return (
    <div className="build-monitor" data-build-id={buildId}>
      <div className="build-monitor__header">
        <h2 className="build-monitor__title">Build Monitor</h2>
        <div className={`build-monitor__overall-status ${getStatusClass(overallStatus)}`}>
          <span className="status-icon">{getStatusIcon(overallStatus)}</span>
          <span className="status-text">{overallStatus.toUpperCase()}</span>
        </div>
      </div>

      {error && (
        <div className="build-monitor__error-banner">
          {error}
        </div>
      )}

      <div className="build-monitor__steps">
        {buildSteps.map((step) => (
          <div 
            key={step.id} 
            className={`build-step ${getStatusClass(step.status)}`}
            data-step-id={step.id}
          >
            <div className="build-step__info">
              <span className="build-step__icon">{getStatusIcon(step.status)}</span>
              <span className="build-step__name">{step.name}</span>
              {step.retryCount > 0 && (
                <span className="build-step__retry-count">
                  (Attempt {step.retryCount + 1}/{MAX_RETRY_ATTEMPTS + 1})
                </span>
              )}
            </div>
            
            <div className="build-step__actions">
              {step.status === BuildStatus.FAILED && (
                <button
                  className="build-step__retry-button"
                  onClick={() => retryStep(step.id)}
                  disabled={(retryAttempts[step.id] || 0) >= MAX_RETRY_ATTEMPTS}
                  title={`Retry step (${MAX_RETRY_ATTEMPTS - (retryAttempts[step.id] || 0)} attempts remaining)`}
                >
                  Retry
                </button>
              )}
              {step.status === BuildStatus.RETRYING && (
                <button
                  className="build-step__cancel-button"
                  onClick={() => cancelRetry(step.id)}
                >
                  Cancel
                </button>
              )}
            </div>

            {step.error && (
              <div className="build-step__error">
                {step.error}
              </div>
            )}

            {step.duration && (
              <div className="build-step__duration">
                {step.duration}ms
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="build-monitor__footer">
        {failedStepsCount > 0 && (
          <button
            className="build-monitor__retry-all-button"
            onClick={retryFailedSteps}
            disabled={overallStatus === BuildStatus.RETRYING}
          >
            Retry All Failed Steps ({failedStepsCount})
          </button>
        )}
        <button
          className="build-monitor__refresh-button"
          onClick={fetchBuildStatus}
          disabled={isLoading}
        >
          Refresh Status
        </button>
        {Object.keys(retryAttempts).length > 0 && (
          <button
            className="build-monitor__reset-button"
            onClick={() => resetRetryAttempts()}
          >
            Reset Retry Counts
          </button>
        )}
      </div>
    </div>
  );
};

BuildMonitor.propTypes = {
  buildId: PropTypes.string.isRequired,
  onBuildComplete: PropTypes.func,
  onError: PropTypes.func,
  apiEndpoint: PropTypes.string
};

export default BuildMonitor;
export { BuildStatus, MAX_RETRY_ATTEMPTS, RETRY_DELAY_MS };