import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ResizePanel.css';

const ResizePanel = ({
  children,
  direction = 'left',
  defaultWidth = 250,
  minWidth = 150,
  maxWidth = 500,
  collapsedWidth = 0,
  onResize,
  onCollapse,
  onExpand,
  collapsed: controlledCollapsed,
  className = '',
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isCollapsed, setIsCollapsed] = useState(controlledCollapsed ?? false);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // Sync with controlled collapsed prop
  useEffect(() => {
    if (controlledCollapsed !== undefined) {
      setIsCollapsed(controlledCollapsed);
    }
  }, [controlledCollapsed]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  }, [width]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;

    const deltaX = direction === 'left' 
      ? e.clientX - startXRef.current 
      : startXRef.current - e.clientX;
    
    let newWidth = startWidthRef.current + deltaX;
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    
    setWidth(newWidth);
    onResize?.(newWidth);
  }, [isResizing, direction, minWidth, maxWidth, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggleCollapse = useCallback(() => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    
    if (newCollapsed) {
      onCollapse?.();
    } else {
      onExpand?.();
    }
  }, [isCollapsed, onCollapse, onExpand]);

  const handleDoubleClick = useCallback(() => {
    setWidth(defaultWidth);
    onResize?.(defaultWidth);
  }, [defaultWidth, onResize]);

  const currentWidth = isCollapsed ? collapsedWidth : width;

  return (
    <div
      ref={panelRef}
      className={`resize-panel resize-panel--${direction} ${isCollapsed ? 'resize-panel--collapsed' : ''} ${isResizing ? 'resize-panel--resizing' : ''} ${className}`}
      style={{ width: currentWidth }}
    >
      <div className="resize-panel__content">
        {children}
      </div>
      
      {!isCollapsed && (
        <div
          className={`resize-panel__handle resize-panel__handle--${direction}`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={width}
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
          tabIndex={0}
        />
      )}
      
      <button
        className={`resize-panel__toggle resize-panel__toggle--${direction}`}
        onClick={toggleCollapse}
        aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        aria-expanded={!isCollapsed}
      >
        <span className="resize-panel__toggle-icon">
          {direction === 'left' 
            ? (isCollapsed ? '›' : '‹') 
            : (isCollapsed ? '‹' : '›')}
        </span>
      </button>
    </div>
  );
};

ResizePanel.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.oneOf(['left', 'right']),
  defaultWidth: PropTypes.number,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  collapsedWidth: PropTypes.number,
  onResize: PropTypes.func,
  onCollapse: PropTypes.func,
  onExpand: PropTypes.func,
  collapsed: PropTypes.bool,
  className: PropTypes.string,
};

export default ResizePanel;
