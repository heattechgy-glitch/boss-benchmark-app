import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface SearchFilterBoxProps {
  placeholder?: string;
  filters?: FilterOption[];
  onSearch: (query: string) => void;
  onFilterChange?: (selectedFilters: string[]) => void;
  debounceMs?: number;
  className?: string;
}

const SearchFilterBox: React.FC<SearchFilterBoxProps> = ({
  placeholder = 'Search benchmarks...',
  filters = [],
  onSearch,
  onFilterChange,
  debounceMs = 300,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((query: string) => onSearch(query), debounceMs),
    [onSearch, debounceMs]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const handleFilterToggle = useCallback(
    (filterValue: string) => {
      setSelectedFilters((prev) => {
        const newFilters = prev.includes(filterValue)
          ? prev.filter((f) => f !== filterValue)
          : [...prev, filterValue];
        onFilterChange?.(newFilters);
        return newFilters;
      });
    },
    [onFilterChange]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    onSearch('');
  }, [onSearch]);

  const clearFilters = useCallback(() => {
    setSelectedFilters([]);
    onFilterChange?.([]);
  }, [onFilterChange]);

  return (
    <div className={`search-filter-box ${className}`}>
      <div className="search-input-container">
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search benchmarks"
        />
        {searchQuery && (
          <button
            className="clear-search-btn"
            onClick={clearSearch}
            aria-label="Clear search"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>

      {filters.length > 0 && (
        <div className="filter-container">
          <button
            className="filter-toggle-btn"
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            aria-expanded={isFilterDropdownOpen}
            aria-haspopup="listbox"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
            {selectedFilters.length > 0 && (
              <span className="filter-badge">{selectedFilters.length}</span>
            )}
          </button>

          {isFilterDropdownOpen && (
            <div className="filter-dropdown" role="listbox">
              <div className="filter-dropdown-header">
                <span>Filter by</span>
                {selectedFilters.length > 0 && (
                  <button
                    className="clear-filters-btn"
                    onClick={clearFilters}
                    type="button"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="filter-options">
                {filters.map((filter) => (
                  <label key={filter.id} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(filter.value)}
                      onChange={() => handleFilterToggle(filter.value)}
                      aria-label={filter.label}
                    />
                    <span className="filter-checkbox">
                      {selectedFilters.includes(filter.value) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className="filter-label">{filter.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedFilters.length > 0 && (
        <div className="selected-filters">
          {selectedFilters.map((filterValue) => {
            const filter = filters.find((f) => f.value === filterValue);
            return (
              <span key={filterValue} className="selected-filter-tag">
                {filter?.label || filterValue}
                <button
                  type="button"
                  onClick={() => handleFilterToggle(filterValue)}
                  aria-label={`Remove ${filter?.label || filterValue} filter`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchFilterBox;
