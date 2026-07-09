import React from 'react';
import PropTypes from 'prop-types';
import './StatusBadge.css';

const StatusBadge = ({ status, tier }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'gray';
      case 'pending':
        return 'yellow';
      case 'warning':
        return 'orange';
      case 'error':
        return 'red';
      default:
        return 'blue';
    }
  };

  const getTierVariant = () => {
    if (tier === 'premium') {
      return 'premium-badge';
    }
    return '';
  };

  const getTierLabel = () => {
    if (tier === 'premium') {
      return 'Premium';
    }
    return '';
  };

  const statusColor = getStatusColor();
  const tierVariant = getTierVariant();
  const tierLabel = getTierLabel();

  return (
    <div className={`status-badge ${tierVariant}`}>
      <div className="status-indicator">
        <span 
          className="status-dot" 
          style={{ backgroundColor: statusColor }}
          title={status}
        />
        <span className="status-text">{status}</span>
      </div>
      {tierLabel && (
        <div className="tier-label">
          {tierLabel}
        </div>
      )}
    </div>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  tier: PropTypes.string
};

StatusBadge.defaultProps = {
  tier: ''
};

export default StatusBadge;