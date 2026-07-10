import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './StatusBadge.css';

const StatusBadge = ({ status, tier }) => {
  const [showTooltip, setShowTooltip] = useState(false);

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

  const getStatusDescription = () => {
    switch (status) {
      case 'active':
        return 'This item is currently active and functioning normally.';
      case 'inactive':
        return 'This item is currently inactive and not in use.';
      case 'pending':
        return 'This item is pending approval or processing.';
      case 'warning':
        return 'This item requires attention due to a potential issue.';
      case 'error':
        return 'This item has encountered an error and needs immediate attention.';
      default:
        return `Current status: ${status}`;
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
  const statusDescription = getStatusDescription();
  const tierVariant = getTierVariant();
  const tierLabel = getTierLabel();
  const tierIcon = getTierIcon();

  return (
    <div 
      className={`status-badge ${tierVariant}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="status-indicator">
        <span 
          className="status-dot" 
          style={{ backgroundColor: statusColor }}
        />
        <span className="status-text">{status}</span>
      </div>
      {tierLabel && (
        <div className="tier-label">
          {tierIcon && <span className="tier-icon">{tierIcon}</span>}
          {tierLabel}
        </div>
      )}
      {showTooltip && (
        <div className="status-tooltip">
          {statusDescription}
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
