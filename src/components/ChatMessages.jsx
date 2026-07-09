import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatMessages.css';
import useChatStore from '../stores/chatStore';

const ChatMessages = ({ conversationId }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [scrollBehavior, setScrollBehavior] = useState('auto');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  
  const { 
    getMessagesByConversationId, 
    isLoadingMessages, 
    markMessagesAsRead,
    deleteMessage,
    editMessage,
    reactions,
    addReaction,
    removeReaction
  } = useChatStore();
  
  const messages = getMessagesByConversationId(conversationId) || [];
  
  // Virtualization prep: track visible messages and container dimensions
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [containerHeight, setContainerHeight] = useState(0);
  const [itemHeights, setItemHeights] = useState({});
  const itemRefs = useRef({});
  
  // Calculate total height for virtualization
  const calculateTotalHeight = useCallback(() => {
    if (messages.length === 0) return 0;
    
    let total = 0;
    for (let i = 0; i < messages.length; i++) {
      const messageId = messages[i].id;
      if (itemHeights[messageId]) {
        total += itemHeights[messageId];
      } else {
        // Default estimated height if not measured yet
        total += messages[i].content.length > 100 ? 120 : 80;
      }
    }
    return total;
  }, [messages, itemHeights]);
  
  // Measure message element heights
  const measureMessageHeights = useCallback(() => {
    const newHeights = {};
    Object.keys(itemRefs.current).forEach(messageId => {
      const element = itemRefs.current[messageId];
      if (element) {
        newHeights[messageId] = element.getBoundingClientRect().height;
      }
    });
    
    if (Object.keys(newHeights).length > 0) {
      setItemHeights(prev => ({ ...prev, ...newHeights }));
    }
  }, []);
  
  // Handle scroll for virtualization
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || messages.length === 0) return;
    
    const container = messagesContainerRef.current;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    
    // Simple virtualization: calculate which messages are visible
    // This is a placeholder for full virtualization implementation
    let currentHeight = 0;
    let startIndex = 0;
    let endIndex = 0;
    
    for (let i = 0; i < messages.length; i++) {
      const messageId = messages[i].id;
      const itemHeight = itemHeights[messageId] || (messages[i].content.length > 100 ? 120 : 80);
      
      if (currentHeight + itemHeight > scrollTop && startIndex === 0) {
        startIndex = Math.max(0, i - 5); // Buffer before
      }
      
      if (currentHeight < scrollTop + clientHeight) {
        endIndex = Math.min(messages.length - 1, i + 10); // Buffer after
      }
      
      currentHeight += itemHeight;
    }
    
    setVisibleRange({ start: startIndex, end: endIndex });
    
    // Mark messages as read when they come into view
    const visibleMessages = messages.slice(startIndex, endIndex + 1);
    visibleMessages.forEach(msg => {
      if (!msg.isRead) {
        markMessagesAsRead([msg.id]);
      }
    });
    
    // Track scrolling state for smooth behavior
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      setScrollBehavior('smooth');
    }, 100);
  }, [messages, itemHeights, markMessagesAsRead]);
  
  // Scroll to bottom function
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior
      });
    }
  }, []);
  
  // Initial scroll to bottom and height measurement
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom('auto');
      
      // Small delay to ensure DOM is rendered before measuring
      const measureTimer = setTimeout(() => {
        measureMessageHeights();
      }, 100);
      
      return () => clearTimeout(measureTimer);
    }
  }, [messages.length, scrollToBottom, measureMessageHeights]);
  
  // Setup scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const handleScrollEvent = () => handleScroll();
    container.addEventListener('scroll', handleScrollEvent);
    
    // Initial visible range calculation
    handleScroll();
    
    return () => {
      container.removeEventListener('scroll', handleScrollEvent);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);
  
  // Measure container height
  useEffect(() => {
    const updateContainerHeight = () => {
      if (messagesContainerRef.current) {
        setContainerHeight(messagesContainerRef.current.clientHeight);
      }
    };
    
    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    
    return () => window.removeEventListener('resize', updateContainerHeight);
  }, []);
  
  // Handle message actions
  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(messageId);
    }
  };
  
  const handleEditMessage = (messageId, newContent) => {
    editMessage(messageId, newContent);
    // Re-measure heights after edit
    setTimeout(measureMessageHeights, 50);
  };
  
  const handleReaction = (messageId, emoji) => {
    const messageReactions = reactions[messageId] || [];
    const userReaction = messageReactions.find(r => r.userId === 'current-user');
    
    if (userReaction) {
      removeReaction(messageId, userReaction.id);
    } else {
      addReaction(messageId, {
        id: `reaction-${Date.now()}`,
        emoji,
        userId: 'current-user',
        timestamp: new Date().toISOString()
      });
    }
  };
  
  // Render message with virtualization prep
  const renderMessage = (message, index) => {
    const messageReactions = reactions[message.id] || [];
    const isVisible = index >= visibleRange.start && index <= visibleRange.end;
    
    // For virtualization, we'll render all messages but hide non-visible ones
    // In production, this would only render visible messages
    return (
      <div 
        key={message.id}
        ref={el => itemRefs.current[message.id] = el}
        className={`message-wrapper ${isVisible ? '' : 'virtual-hidden'}`}
        data-message-index={index}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`message ${message.senderId === 'user1' ? 'sent' : 'received'}`}
        >
          <div className="message-content">
            <p>{message.content}</p>
            <div className="message-meta">
              <span className="timestamp">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {message.isEdited && <span className="edited">(edited)</span>}
              {message.senderId === 'user1' && (
                <span className={`read-status ${message.isRead ? 'read' : 'unread'}`}>
                  {message.isRead ? '✓✓' : '✓'}
                </span>
              )}
            </div>
          </div>
          
          <div className="message-actions">
            {message.senderId === 'user1' && (
              <>
                <button 
                  className="action-btn edit-btn"
                  onClick={() => {
                    const newContent = prompt('Edit message:', message.content);
                    if (newContent && newContent !== message.content) {
                      handleEditMessage(message.id, newContent);
                    }
                  }}
                >
                  Edit
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteMessage(message.id)}
                >
                  Delete
                </button>
              </>
            )}
            <div className="reactions">
              {['👍', '❤️', '😂', '😮', '😢'].map(emoji => (
                <button
                  key={emoji}
                  className={`reaction-btn ${messageReactions.some(r => r.emoji === emoji && r.userId === 'current-user') ? 'active' : ''}`}
                  onClick={() => handleReaction(message.id, emoji)}
                >
                  {emoji}
                  <span className="reaction-count">
                    {messageReactions.filter(r => r.emoji === emoji).length || ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {messageReactions.length > 0 && (
            <div className="message-reactions">
              {messageReactions.map(reaction => (
                <span key={reaction.id} className="reaction-badge">
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    );
  };
  
  // Virtualization: calculate padding for non-visible items
  const calculateVirtualPadding = () => {
    let topPadding = 0;
    let bottomPadding = 0;
    
    // Calculate top padding (height of messages before visible range)
    for (let i = 0; i < visibleRange.start; i++) {
      const messageId = messages[i].id;
      topPadding += itemHeights[messageId] || (messages[i].content.length > 100 ? 120 : 80);
    }
    
    // Calculate bottom padding (height of messages after visible range)
    for (let i = visibleRange.end + 1; i < messages.length; i++) {
      const messageId = messages[i].id;
      bottomPadding += itemHeights[messageId] || (messages[i].content.length > 100 ? 120 : 80);
    }
    
    return { topPadding, bottomPadding };
  };
  
  const { topPadding, bottomPadding } = calculateVirtualPadding();
  
  return (
    <div 
      className={`chat-messages ${isScrolling ? 'scrolling' : ''}`}
      ref={messagesContainerRef}
      data-testid="chat-messages-container"
    >
      <div className="messages-list">
        {/* Top padding for virtualization */}
        <div style={{ height: `${topPadding}px` }} className="virtual-padding" />
        
        <AnimatePresence>
          {messages.map((message, index) => renderMessage(message, index))}
        </AnimatePresence>
        
        {/* Bottom padding for virtualization */}
        <div style={{ height: `${bottomPadding}px` }} className="virtual-padding" />
        
        <div ref={messagesEndRef} />
      </div>
      
      {isLoadingMessages && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading messages...</div>
        </div>
      )}
      
      {/* Scroll to bottom button */}
      {messagesContainerRef.current && 
       messagesContainerRef.current.scrollHeight - messagesContainerRef.current.scrollTop > 
       messagesContainerRef.current.clientHeight + 100 && (
        <button 
          className="scroll-to-bottom-btn"
          onClick={() => scrollToBottom('smooth')}
        >
          ↓
        </button>
      )}
      
      {/* Virtualization debug info (remove in production) */}
      <div className="virtualization-info">
        <small>
          Showing {Math.min(messages.length, visibleRange.end - visibleRange.start + 1)} of {messages.length} messages
          | Range: {visibleRange.start}-{visibleRange.end}
          | Container: {Math.round(containerHeight)}px
        </small>
      </div>
    </div>
  );
};

ChatMessages.propTypes = {
  conversationId: PropTypes.string.isRequired
};

export default ChatMessages;