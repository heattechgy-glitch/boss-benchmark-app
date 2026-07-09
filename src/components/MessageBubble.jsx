import React from 'react';
import PropTypes from 'prop-types';
import { TimeFormatter } from '../utils/TimeFormatter';

const MessageBubble = ({ message, isOwnMessage }) => {
  const formatTimestamp = (timestamp) => {
    return TimeFormatter.formatMessageTime(timestamp);
  };

  return (
    <div className={`message-bubble ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      <div className="message-content">
        <div className="message-text">{message.text}</div>
        <div className="message-meta">
          <span className="message-sender">{message.sender}</span>
          <span className="message-timestamp">{formatTimestamp(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
  }).isRequired,
  isOwnMessage: PropTypes.bool.isRequired,
};

export default MessageBubble;