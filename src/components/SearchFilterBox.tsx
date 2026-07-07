import React, { useState, useCallback, useMemo } from 'react';
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
        <div className="active-filters">
          {selectedFilters.map((filterValue) => {
            const filter = filters.find((f) => f.value === filterValue);
            return (
              <span key={filterValue} className="active-filter-tag">
                {filter?.label || filterValue}
                <button
                  onClick={() => handleFilterToggle(filterValue)}
                  aria-label={`Remove ${filter?.label || filterValue} filter`}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
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
              </span>
            );
          })}
        </div>
      )}

      <style>{`
        .search-filter-box {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .search-input-container {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 200px;
          background: #f5f7fa;
          border-radius: 8px;
          padding: 8px 12px;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .search-input-container:focus-within {
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-icon {
          color: #9ca3af;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 14px;
          color: #1f2937;
          outline: none;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .clear-search-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .clear-search-btn:hover {
          color: #6b7280;
          background: #e5e7eb;
        }

        .filter-container {
          position: relative;
        }

        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #f5f7fa;
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-toggle-btn:hover {
          background: #e5e7eb;
        }

        .filter-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          background: #3b82f6;
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          border-radius: 10px;
        }

        .filter-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 220px;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 100;
          overflow: hidden;
        }

        .filter-dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
        }

        .clear-filters-btn {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .clear-filters-btn:hover {
          background: #eff6ff;
        }

        .filter-options {
          padding: 8px 0;
          max-height: 240px;
          overflow-y: auto;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .filter-option:hover {
          background: #f9fafb;
        }

        .filter-option input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          background: #ffffff;
          transition: all 0.2s ease;
        }

        .filter-option input:checked + .filter-checkbox {
          background: #3b82f6;
          border-color: #3b82f6;
          color: #ffffff;
        }

        .filter-label {
          font-size: 14px;
          color: #374151;
        }

        .active-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          width: 100%;
          margin-top: 4px;
        }

        .active-filter-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 500;
          border-radius: 6px;
        }

        .active-filter-tag button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          padding: 2px;
          border-radius: 3px;
          transition: all 0.2s ease;
        }

        .active-filter-tag button:hover {
          background: #dbeafe;
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default SearchFilterBox;