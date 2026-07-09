import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatMessages.css';
import useChatStore from '../stores/chatStore';

const BUFFER_SIZE = 5;
const DEFAULT_ITEM_HEIGHT = 80;
const LONG_MESSAGE_HEIGHT = 120;
const LONG_MESSAGE_THRESHOLD = 100;
const SCROLL_DEBOUNCE_MS = 100;
const MEASURE_DELAY_MS = 100;

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
  
  // Memoized function to estimate message height
  const estimateMessageHeight = useCallback((message) => {
    if (itemHeights[message.id]) {
      return itemHeights[message.id];
    }
    return message.content.length > LONG_MESSAGE_THRESHOLD ? LONG_MESSAGE_HEIGHT : DEFAULT_ITEM_HEIGHT;
  }, [itemHeights]);
  
  // Calculate total height for virtualization
  const totalHeight = useMemo(() => {
    if (messages.length === 0) return 0;
    
    return messages.reduce((total, message) => {
      return total + estimateMessageHeight(message);
    }, 0);
  }, [messages, estimateMessageHeight]);
  
  // Measure message element heights
  const measureMessageHeights = useCallback(() => {
    const newHeights = {};
    let hasChanges = false;
    
    Object.keys(itemRefs.current).forEach(messageId => {
      const element = itemRefs.current[messageId];
      if (element) {
        const height = element.getBoundingClientRect().height;
        if (height !== itemHeights[messageId]) {
          newHeights[messageId] = height;
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      setItemHeights(prev => ({ ...prev, ...newHeights }));
    }
  }, [itemHeights]);
  
  // Build height offset map for efficient scroll position lookup
  const heightOffsetMap = useMemo(() => {
    const offsets = [];
    let currentOffset = 0;
    
    for (let i = 0; i < messages.length; i++) {
      offsets.push(currentOffset);
      currentOffset += estimateMessageHeight(messages[i]);
    }
    
    return offsets;
  }, [messages, estimateMessageHeight]);
  
  // Binary search to find start index for given scroll position
  const findStartIndex = useCallback((scrollTop) => {
    if (heightOffsetMap.length === 0) return 0;
    
    let low = 0;
    let high = heightOffsetMap.length - 1;
    
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (heightOffsetMap[mid] < scrollTop) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    
    return Math.max(0, low - 1);
  }, [heightOffsetMap]);
  
  // Handle scroll for virtualization
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || messages.length === 0) return;
    
    const container = messagesContainerRef.current;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    
    // Use binary search for efficient index lookup
    const startIndex = Math.max(0, findStartIndex(scrollTop) - BUFFER_SIZE);
    
    // Find end index
    let endIndex = startIndex;
    let currentHeight = heightOffsetMap[startIndex] || 0;
    const viewportEnd = scrollTop + clientHeight;
    
    while (endIndex < messages.length && currentHeight < viewportEnd) {
      currentHeight += estimateMessageHeight(messages[endIndex]);
      endIndex++;
    }
    
    endIndex = Math.min(messages.length - 1, endIndex + BUFFER_SIZE);
    
    setVisibleRange(prev => {
      if (prev.start === startIndex && prev.end === endIndex) {
        return prev;
      }
      return { start: startIndex, end: endIndex };
    });
    
    // Mark messages as read when they come into view
    const unreadMessages = messages
      .slice(startIndex, endIndex + 1)
      .filter(msg => !msg.isRead)
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      markMessagesAsRead(unreadMessages);
    }
    
    // Track scrolling state for smooth behavior
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      setScrollBehavior('smooth');
    }, SCROLL_DEBOUNCE_MS);
  }, [messages, estimateMessageHeight, heightOffsetMap, findStartIndex, markMessagesAsRead]);
  
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
      }, MEASURE_DELAY_MS);
      
      return () => clearTimeout(measureTimer);
    }
  }, [messages.length, scrollToBottom, measureMessageHeights]);
  
  // Setup scroll listener with passive option for better performance
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const handleScrollEvent = () => handleScroll();
    container.addEventListener('scroll', handleScrollEvent, { passive: true });
    
    // Initial visible range calculation
    handleScroll();
    
    return () => {
      container.removeEventListener('scroll', handleScrollEvent);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);
  
  // Measure container height with ResizeObserver for better performance
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const updateContainerHeight = () => {
      setContainerHeight(container.clientHeight);
    };
    
    updateContainerHeight();
    
    // Use ResizeObserver if available for better performance
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(updateContainerHeight);
      resizeObserver.observe(container);
      return () => resizeObserver.disconnect();
    } else {
      window.addEventListener('resize', updateContainerHeight);
      return () => window.removeEventListener('resize', updateContainerHeight);
    }
  }, []);
  
  // Handle message actions
  const handleDeleteMessage = useCallback((messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(messageId);
    }
  }, [deleteMessage]);
  
  const handleEditMessage = useCallback((messageId, newContent) => {
    editMessage(messageId, newContent);
    // Re-measure heights after edit
    setTimeout(measureMessageHeights, 50);
  }, [editMessage, measureMessageHeights]);
  
  const handleReaction = useCallback((messageId, emoji) => {
    const messageReactions = reactions[messageId] || [];
    const userReaction = messageReactions.find(r => r.userId === 'currentUser' && r.emoji === emoji);
    
    if (userReaction) {
      removeReaction(messageId, 'currentUser', emoji);
    } else {
      addReaction(messageId, 'currentUser', emoji);
    }
  }, [reactions, addReaction, removeReaction]);
  
  // Register item ref for height measurement
  const setItemRef = useCallback((messageId, element) => {
    if (element) {
      itemRefs.current[messageId] = element;
    } else {
      delete itemRefs.current[messageId];
    }
  }, []);
  
  // Get visible messages for rendering
  const visibleMessages = useMemo(() => {
    return messages.slice(visibleRange.start, visibleRange.end + 1);
  }, [messages, visibleRange]);
  
  // Calculate spacer heights for virtualization
  const topSpacerHeight = useMemo(() => {
    return heightOffsetMap[visibleRange.start] || 0;
  }, [heightOffsetMap, visibleRange.start]);
  
  const bottomSpacerHeight = useMemo(() => {
    if (messages.length === 0) return 0;
    const endOffset = heightOffsetMap[visibleRange.end] || 0;
    const endHeight = estimateMessageHeight(messages[visibleRange.end]);
    return Math.max(0, totalHeight - endOffset - endHeight);
  }, [messages, heightOffsetMap, visibleRange.end, totalHeight, estimateMessageHeight]);
  
  if (isLoadingMessages) {
    return (
      <div className="chat-messages-loading">
        <div className="loading-spinner" />
        <span>Loading messages...</span>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="chat-messages-empty">
        <span>No messages yet. Start the conversation!</span>
      </div>
    );
  }
  
  return (
    <div 
      ref={messagesContainerRef} 
      className="chat-messages-container"
      role="log"
      aria-live="polite"
    >
      {/* Top spacer for virtualization */}
      <div style={{ height: topSpacerHeight }} aria-hidden="true" />
      
      <AnimatePresence initial={false}>
        {visibleMessages.map((message, index) => (
          <motion.div
            key={message.id}
            ref={(el) => setItemRef(message.id, el)}
            className={`chat-message ${message.isOwn ? 'own' : 'other'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="message-content">
              <p>{message.content}</p>
              <span className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-actions">
              <button 
                onClick={() => handleReaction(message.id, '👍')}
                aria-label="Like message"
              >
                👍
              </button>
              {message.isOwn && (
                <>
                  <button 
                    onClick={() => handleEditMessage(message.id, prompt('Edit message:', message.content))}
                    aria-label="Edit message"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDeleteMessage(message.id)}
                    aria-label="Delete message"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
            {reactions[message.id]?.length > 0 && (
              <div className="message-reactions">
                {reactions[message.id].map((reaction, idx) => (
                  <span key={`${reaction.userId}-${reaction.emoji}-${idx}`}>
                    {reaction.emoji}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Bottom spacer for virtualization */}
      <div style={{ height: bottomSpacerHeight }} aria-hidden="true" />
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default React.memo(ChatMessages);