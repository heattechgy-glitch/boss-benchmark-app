import React, { useState } from 'react';

const DeployButton = ({ onDeploy, disabled }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;
    
    setIsLoading(true);
    try {
      await onDeploy();
    } catch (error) {
      console.error('Deploy failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`deploy-button ${isLoading ? 'loading' : ''}`}
      onClick={handleClick}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <span className="spinner" aria-hidden="true"></span>
          <span>Deploying...</span>
        </>
      ) : (
        <span>Deploy</span>
      )}
    </button>
  );
};

export default DeployButton;
