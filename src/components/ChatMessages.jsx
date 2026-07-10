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
const MAX_CHARACTER_COUNT = 500;

const ChatMessages = ({ conversationId }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [scrollBehavior, setScrollBehavior] = useState('auto');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const [messageInput, setMessageInput] = useState('');
  
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
  
  // Handle message input change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARACTER_COUNT) {
      setMessageInput(value);
    }
  }, []);
  
  // Character count display
  const characterCount = messageInput.length;
  const isNearLimit = characterCount >= MAX_CHARACTER_COUNT * 0.9;
  const isAtLimit = characterCount >= MAX_CHARACTER_COUNT;
  
  // Setup scroll listener with passive option for better performance
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  return (
    <div className="chat-messages-wrapper">
      <div 
        className="chat-messages-container" 
        ref={messagesContainerRef}
      >
        {isLoadingMessages ? (
          <div className="loading-messages">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          <div style={{ height: totalHeight, position: 'relative' }}>
            <AnimatePresence>
              {messages.slice(visibleRange.start, visibleRange.end + 1).map((message, index) => (
                <motion.div
                  key={message.id}
                  ref={el => itemRefs.current[message.id] = el}
                  className={`message ${message.isOwn ? 'own-message' : 'other-message'}`}
                  style={{
                    position: 'absolute',
                    top: heightOffsetMap[visibleRange.start + index] || 0,
                    width: '100%'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="message-content">{message.content}</div>
                  <div className="message-timestamp">{message.timestamp}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          value={messageInput}
          onChange={handleInputChange}
          placeholder="Type a message..."
          maxLength={MAX_CHARACTER_COUNT}
        />
        <div className={`character-counter ${isNearLimit ? 'near-limit' : ''} ${isAtLimit ? 'at-limit' : ''}`}>
          {characterCount}/{MAX_CHARACTER_COUNT}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;