import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiBell, FiUser, FiClock } from 'react-icons/fi';

const Header = ({ searchQuery, onSearchChange, fetchSuggestions, onSelectCandidate }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  const recentSearches = ['DevOps Engineer', 'backend'];
  const trySearching = ['Python Developer', 'Java Developer', 'React Developer', 'Full Stack Developer', 'Data Scientist'];

  useEffect(() => {
    const getSuggestions = async () => {
      if (searchQuery.length > 1) {
        const results = await fetchSuggestions(searchQuery);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        // Keep dropdown open if focused even without text to show recent/recommended
      }
    };

    const timer = setTimeout(getSuggestions, 100);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchSuggestions]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionItemClick = (query) => {
    onSearchChange(query);
    setShowSuggestions(false);
  };

  return (
    <header className="header" ref={dropdownRef}>
      <div className="header-left">
        <div className="search-wrapper">
          <div className="search-bar">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
            />
            <button className="btn-search-primary">Search</button>
          </div>
          
          {showSuggestions && (
            <div className="suggestions-dropdown animate-fade-in">
              {searchQuery.length < 2 ? (
                <>
                  <div className="suggestions-section">
                    <div className="section-header">
                      <span>RECENT</span>
                      <button className="clear-btn">Clear</button>
                    </div>
                    {recentSearches.map((item, idx) => (
                      <div key={idx} className="suggestion-item" onClick={() => handleSuggestionItemClick(item)}>
                        <FiClock /> <span className="text">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="suggestions-section">
                    <div className="section-header">
                      <span>TRY SEARCHING FOR</span>
                    </div>
                    {trySearching.map((item, idx) => (
                      <div key={idx} className="suggestion-item" onClick={() => handleSuggestionItemClick(item)}>
                        <FiSearch /> <span className="text">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="suggestions-section">
                  <div className="section-header">
                    <span>SUGGESTIONS</span>
                  </div>
                  {suggestions.length > 0 ? (
                    suggestions.map((item, idx) => (
                      <div key={idx} className="suggestion-item" onClick={() => handleSuggestionItemClick(item)}>
                        <FiSearch /> <span className="text">{item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="suggestion-item"><span className="text" style={{ color: '#94a3b8' }}>No matches found</span></div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="header-right">
        <button className="icon-btn">
          <FiBell size={20} />
          <span className="badge">3</span>
        </button>
        
        <div className="user-profile">
          <div className="avatar">E</div>
          <div className="user-info">
            <span className="user-name">Employer</span>
            <span className="user-role">Technical Recruiter</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
