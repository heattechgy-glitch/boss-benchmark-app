import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CodeDisplay.css';

const CodeDisplay = ({ code, language = 'javascript', title = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="code-display-container">
      <div className="code-display-header">
        {title && <span className="code-display-title">{title}</span>}
        <span className="code-display-language">{language}</span>
        <button
          className={`copy-to-clipboard-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopyToClipboard}
          aria-label={copied ? 'Copied!' : 'Copy code to clipboard'}
          title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? (
            <>
              <svg
                className="copy-icon check-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="copy-text">Copied!</span>
            </>
          ) : (
            <>
              <svg
                className="copy-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="copy-text">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-display-content">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

CodeDisplay.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string,
  title: PropTypes.string,
};

export default CodeDisplay;
