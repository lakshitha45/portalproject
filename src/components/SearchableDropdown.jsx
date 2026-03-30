import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiSearch, FiX } from 'react-icons/fi';

const SearchableDropdown = ({ label, options, value, onChange, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find(opt => opt.value === value)?.label || '';

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  return (
    <div className="searchable-dropdown" ref={containerRef}>
      {/* Trigger Button */}
      <div
        className={`sd-trigger ${isOpen ? 'sd-trigger--open' : ''} ${value ? 'sd-trigger--has-value' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`sd-trigger-text ${!value ? 'sd-placeholder' : ''}`}>
          {selectedLabel || placeholder}
        </span>
        <div className="sd-trigger-icons">
          {value && (
            <FiX
              className="sd-clear-icon"
              onClick={handleClear}
              size={14}
            />
          )}
          <FiChevronDown
            className={`sd-chevron ${isOpen ? 'sd-chevron--open' : ''}`}
            size={16}
          />
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="sd-panel">
          {/* Search box */}
          <div className="sd-search-box">
            <FiSearch className="sd-search-icon" size={14} />
            <input
              ref={searchInputRef}
              type="text"
              className="sd-search-input"
              placeholder={`Search ${label || ''}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <FiX
                className="sd-search-clear"
                size={13}
                onClick={() => setSearch('')}
              />
            )}
          </div>

          {/* Options list */}
          <div className="sd-options-list">
            {filteredOptions.length === 0 ? (
              <div className="sd-no-results">No results found</div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`sd-option ${opt.value === value ? 'sd-option--selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && (
                    <span className="sd-check">✓</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
