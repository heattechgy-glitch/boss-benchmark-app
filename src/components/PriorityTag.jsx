import React from 'react';
import PropTypes from 'prop-types';

const PRIORITY_CONFIG = {
  critical: {
    label: 'Critical',
    bgColor: 'bg-red-600',
    textColor: 'text-white',
    borderColor: 'border-red-700',
    icon: '🔴'
  },
  high: {
    label: 'High',
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    borderColor: 'border-orange-600',
    icon: '🟠'
  },
  medium: {
    label: 'Medium',
    bgColor: 'bg-yellow-400',
    textColor: 'text-gray-900',
    borderColor: 'border-yellow-500',
    icon: '🟡'
  },
  low: {
    label: 'Low',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    borderColor: 'border-green-600',
    icon: '🟢'
  },
  none: {
    label: 'None',
    bgColor: 'bg-gray-300',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-400',
    icon: '⚪'
  }
};

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base'
};

const PriorityTag = ({
  priority = 'none',
  size = 'md',
  showIcon = true,
  showLabel = true,
  className = '',
  onClick = null
}) => {
  const normalizedPriority = priority?.toLowerCase() || 'none';
  const config = PRIORITY_CONFIG[normalizedPriority] || PRIORITY_CONFIG.none;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const baseClasses = `inline-flex items-center gap-1 rounded-full font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClass}`;
  const interactiveClasses = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  const handleClick = (e) => {
    if (onClick) {
      onClick(e, priority);
    }
  };

  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e, priority);
    }
  };

  return (
    <span
      className={`${baseClasses} ${interactiveClasses} ${className}`.trim()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : 'status'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Priority: ${config.label}`}
    >
      {showIcon && <span aria-hidden="true">{config.icon}</span>}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

PriorityTag.propTypes = {
  priority: PropTypes.oneOf(['critical', 'high', 'medium', 'low', 'none', 'Critical', 'High', 'Medium', 'Low', 'None']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showIcon: PropTypes.bool,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export const getPriorityConfig = (priority) => {
  const normalizedPriority = priority?.toLowerCase() || 'none';
  return PRIORITY_CONFIG[normalizedPriority] || PRIORITY_CONFIG.none;
};

export const PRIORITIES = Object.keys(PRIORITY_CONFIG);

export default PriorityTag;
