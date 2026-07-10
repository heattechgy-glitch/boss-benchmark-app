import React, { useState } from 'react';

const LoadingSpinner = () => (
  <svg
    className="spinner-svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeDasharray="31.4 31.4"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

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
        <LoadingSpinner />
      ) : (
        <span>Deploy</span>
      )}
    </button>
  );
};

export default DeployButton;
