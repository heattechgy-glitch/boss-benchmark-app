import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import './SelectModel.css';

const SelectModel = ({ models, selectedModel, onModelChange, disabled, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filteredModels = useMemo(() => {
    if (!searchTerm.trim()) {
      return models;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return models.filter(model => {
      const modelName = typeof model === 'string' ? model : model.name || model.id || '';
      return modelName.toLowerCase().includes(lowerSearch);
    });
  }, [models, searchTerm]);

  const getModelDisplay = (model) => {
    if (typeof model === 'string') return model;
    return model.name || model.id || model.label || '';
  };

  const getModelValue = (model) => {
    if (typeof model === 'string') return model;
    return model.id || model.value || model.name || '';
  };

  const selectedModelDisplay = useMemo(() => {
    if (!selectedModel) return '';
    const found = models.find(m => getModelValue(m) === selectedModel);
    return found ? getModelDisplay(found) : selectedModel;
  }, [selectedModel, models]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredModels]);

  useEffect(() => {
    if (isOpen && listRef.current && filteredModels.length > 0) {
      const highlightedElement = listRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen, filteredModels]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const handleSelectModel = (model) => {
    const value = getModelValue(model);
    onModelChange(value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (event) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredModels.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (filteredModels[highlightedIndex]) {
          handleSelectModel(filteredModels[highlightedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        break;
      default:
        break;
    }
  };

  return (
    <div 
      className={`select-model ${disabled ? 'select-model--disabled' : ''}`}
      ref={dropdownRef}
    >
      <div
        className={`select-model__trigger ${isOpen ? 'select-model__trigger--open' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            className="select-model__search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search models..."
            onClick={(e) => e.stopPropagation()}
            aria-label="Search models"
          />
        ) : (
          <span className="select-model__value">
            {selectedModelDisplay || placeholder || 'Select a model'}
          </span>
        )}
        <span className={`select-model__arrow ${isOpen ? 'select-model__arrow--up' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <ul
          ref={listRef}
          className="select-model__dropdown"
          role="listbox"
          aria-label="Model options"
        >
          {filteredModels.length === 0 ? (
            <li className="select-model__option select-model__option--empty">
              No models found
            </li>
          ) : (
            filteredModels.map((model, index) => {
              const value = getModelValue(model);
              const display = getModelDisplay(model);
              const isSelected = value === selectedModel;
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={value}
                  className={`select-model__option ${isSelected ? 'select-model__option--selected' : ''} ${isHighlighted ? 'select-model__option--highlighted' : ''}`}
                  onClick={() => handleSelectModel(model)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="select-model__option-text">{display}</span>
                  {isSelected && (
                    <span className="select-model__check">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M11.5 4L5.5 10L2.5 7" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};

SelectModel.propTypes = {
  models: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.string,
        label: PropTypes.string,
      }),
    ])
  ).isRequired,
  selectedModel: PropTypes.string,
  onModelChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

SelectModel.defaultProps = {
  models: [],
  selectedModel: '',
  disabled: false,
  placeholder: 'Select a model',
};

export default SelectModel;
