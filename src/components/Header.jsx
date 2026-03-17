import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

const Header = ({ searchQuery, onSearchChange, fetchSuggestions, onSelectCandidate }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSuggestions = async () => {
      if (searchQuery.length > 1) {
        setLoading(true);
        const results = await fetchSuggestions(searchQuery);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
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

  const handleSuggestionClick = (candidate) => {
    onSelectCandidate(candidate);
    setShowSuggestions(false);
    onSearchChange(''); // Clear search after selection
  };

  return (
    <header className="header" ref={dropdownRef}>
      <div className="header-left">
        <div className="search-wrapper">
          <div className="search-bar">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search candidates by name, skills..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
            />
            <button className="btn btn-primary search-btn">Search</button>
          </div>
          
          {showSuggestions && (
            <div className="suggestions-dropdown animate-fade-in">
              {suggestions.map((c) => (
                <div 
                  key={c.id} 
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(c)}
                >
                  <div className="suggestion-avatar">
                    <FiUser />
                  </div>
                  <div className="suggestion-info">
                    <span className="name">{c.name}</span>
                    <span className="role">{c.role}</span>
                  </div>
                </div>
              ))}
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
