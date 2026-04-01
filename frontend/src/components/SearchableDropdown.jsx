import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { FiChevronDown, FiSearch, FiX } from 'react-icons/fi';

const SearchableDropdown = ({ label, options, value, onChange, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [coords, setCoords] = useState(null);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const updatePosition = () => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(e.target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target))
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      searchInputRef.current?.focus();
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

      {isOpen && coords && ReactDOM.createPortal(
        <div 
          ref={dropdownRef}
          className="sd-panel" 
          style={{ 
            position: 'absolute', 
            top: coords.top, 
            left: coords.left, 
            width: coords.width,
            zIndex: 99999 
          }}
        >
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default SearchableDropdown;
