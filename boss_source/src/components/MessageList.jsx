import React, { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Message from './Message';
import './MessageList.css';

const MessageList = ({ messages, onMessageSelect, selectedMessageId, onMessageDelete, onMessageEdit }) => {
  const listRef = useRef(null);
  const messageRefs = useRef([]);

  // Update refs array when messages change
  useEffect(() => {
    messageRefs.current = messageRefs.current.slice(0, messages.length);
  }, [messages]);

  const getSelectedIndex = useCallback(() => {
    if (!selectedMessageId) return -1;
    return messages.findIndex(msg => msg.id === selectedMessageId);
  }, [messages, selectedMessageId]);

  const focusMessage = useCallback((index) => {
    if (index >= 0 && index < messages.length && messageRefs.current[index]) {
      messageRefs.current[index].focus();
    }
  }, [messages.length]);

  const handleKeyDown = useCallback((event) => {
    const currentIndex = getSelectedIndex();
    
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = currentIndex < messages.length - 1 ? currentIndex + 1 : 0;
        if (messages[nextIndex] && onMessageSelect) {
          onMessageSelect(messages[nextIndex].id);
        }
        focusMessage(nextIndex);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : messages.length - 1;
        if (messages[prevIndex] && onMessageSelect) {
          onMessageSelect(messages[prevIndex].id);
        }
        focusMessage(prevIndex);
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (currentIndex >= 0 && messages[currentIndex] && onMessageSelect) {
          onMessageSelect(messages[currentIndex].id);
        }
        break;
      }
      case 'Delete':
      case 'Backspace': {
        if (event.shiftKey && currentIndex >= 0 && messages[currentIndex] && onMessageDelete) {
          event.preventDefault();
          onMessageDelete(messages[currentIndex].id);
        }
        break;
      }
      case 'e':
      case 'E': {
        if (event.ctrlKey && currentIndex >= 0 && messages[currentIndex] && onMessageEdit) {
          event.preventDefault();
          onMessageEdit(messages[currentIndex].id);
        }
        break;
      }
      case 'Home': {
        event.preventDefault();
        if (messages.length > 0 && onMessageSelect) {
          onMessageSelect(messages[0].id);
          focusMessage(0);
        }
        break;
      }
      case 'End': {
        event.preventDefault();
        if (messages.length > 0 && onMessageSelect) {
          onMessageSelect(messages[messages.length - 1].id);
          focusMessage(messages.length - 1);
        }
        break;
      }
      default:
        break;
    }
  }, [getSelectedIndex, messages, onMessageSelect, onMessageDelete, onMessageEdit, focusMessage]);

  const handleMessageClick = useCallback((messageId) => {
    if (onMessageSelect) {
      onMessageSelect(messageId);
    }
  }, [onMessageSelect]);

  const setMessageRef = useCallback((el, index) => {
    messageRefs.current[index] = el;
  }, []);

  if (!messages || messages.length === 0) {
    return (
      <div className="message-list message-list--empty" role="list" aria-label="Messages">
        <p className="message-list__empty-text">No messages yet</p>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="message-list"
      role="listbox"
      aria-label="Message list"
      aria-activedescendant={selectedMessageId ? `message-${selectedMessageId}` : undefined}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {messages.map((message, index) => (
        <div
          key={message.id}
          id={`message-${message.id}`}
          ref={(el) => setMessageRef(el, index)}
          role="option"
          aria-selected={message.id === selectedMessageId}
          tabIndex={message.id === selectedMessageId ? 0 : -1}
          className={`message-list__item ${message.id === selectedMessageId ? 'message-list__item--selected' : ''}`}
          onClick={() => handleMessageClick(message.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleMessageClick(message.id);
            }
          }}
        >
          <Message
            message={message}
            isSelected={message.id === selectedMessageId}
            onDelete={onMessageDelete}
            onEdit={onMessageEdit}
          />
        </div>
      ))}
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      content: PropTypes.string,
      text: PropTypes.string,
      sender: PropTypes.string,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)])
    })
  ),
  onMessageSelect: PropTypes.func,
  selectedMessageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onMessageDelete: PropTypes.func,
  onMessageEdit: PropTypes.func
};

MessageList.defaultProps = {
  messages: [],
  onMessageSelect: null,
  selectedMessageId: null,
  onMessageDelete: null,
  onMessageEdit: null
};

export default MessageList;
