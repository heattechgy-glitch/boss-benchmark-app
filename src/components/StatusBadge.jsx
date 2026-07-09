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
    switch (tier) {
      case 'premium':
        return 'premium-badge';
      case 'premium-plus':
        return 'premium-plus-badge';
      case 'enterprise':
        return 'enterprise-badge';
      default:
        return '';
    }
  };

  const getTierLabel = () => {
    switch (tier) {
      case 'premium':
        return 'Premium';
      case 'premium-plus':
        return 'Premium+';
      case 'enterprise':
        return 'Enterprise';
      default:
        return '';
    }
  };

  const getTierIcon = () => {
    switch (tier) {
      case 'premium':
        return '⭐';
      case 'premium-plus':
        return '💎';
      case 'enterprise':
        return '👑';
      default:
        return null;
    }
  };

  const statusColor = getStatusColor();
  const tierVariant = getTierVariant();
  const tierLabel = getTierLabel();
  const tierIcon = getTierIcon();

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
          {tierIcon && <span className="tier-icon">{tierIcon}</span>}
          {tierLabel}
        </div>
      )}
    </div>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  tier: PropTypes.oneOf(['', 'premium', 'premium-plus', 'enterprise'])
};

StatusBadge.defaultProps = {
  tier: ''
};

export default StatusBadge;
