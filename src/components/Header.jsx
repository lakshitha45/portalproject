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
        {/* Search has moved to FilterSection */}
      </div>
      
      <div className="header-right">
        {/* User area */}
      </div>
    </header>
  );
};

export default Header;
