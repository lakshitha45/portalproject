import React, { useState } from 'react';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

const FilterSection = ({ filters, onFilterChange, onClearAll, onRemoveKeyword }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="filter-section animate-fade-in">
      <div className="filter-main">
        <div className="search-with-filters">
          <div className="active-keywords">
            <span className="label">ACTIVE SEARCH KEYWORDS</span>
            <div className="keyword-tags">
              {filters.keywords.map((filter, index) => (
                <span key={index} className="keyword-tag">
                  {filter} <FiX onClick={() => onRemoveKeyword(filter)} />
                </span>
              ))}
            </div>
          </div>

          <div className="filter-actions">
            <button
              className="advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <FiFilter /> Advanced Filters <FiChevronDown className={showAdvanced ? 'up' : ''} />
            </button>
            <button className="clear-all" onClick={onClearAll}>Clear All</button>
          </div>
        </div>

        {showAdvanced && (
          <div className="advanced-filters-panel animate-slide-in">
            <div className="filter-group">
              <label>Job Position</label>
              <select
                value={filters.role}
                onChange={(e) => onFilterChange('role', e.target.value)}
              >
                <option value="">Any Position</option>
                <option value="Java Developer">Java Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="React Developer">React Developer</option>
                <option value="Backend Engineer">Backend Engineer</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <select
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
              >
                <option value="">Any Location</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Locality</label>
              <select
                value={filters.locality}
                onChange={(e) => onFilterChange('locality', e.target.value)}
                disabled={!filters.location}
              >
                <option value="">Any Locality</option>
                {filters.location === 'Chennai' && (
                  <>
                    <option value="Adyar">Adyar</option>
                    <option value="Velachery">Velachery</option>
                    <option value="T. Nagar">T. Nagar</option>
                    <option value="Anna Nagar">Anna Nagar</option>
                  </>
                )}
                {filters.location === 'Bangalore' && (
                  <>
                    <option value="Koramangala">Koramangala</option>
                    <option value="Indiranagar">Indiranagar</option>
                    <option value="Whitefield">Whitefield</option>
                  </>
                )}
                {filters.location === 'Hyderabad' && (
                  <>
                    <option value="Gachibowli">Gachibowli</option>
                    <option value="Madhapur">Madhapur</option>
                    <option value="Jubilee Hills">Jubilee Hills</option>
                  </>
                )}
              </select>
            </div>

            <div className="filter-group">
              <label>Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => onFilterChange('experience', e.target.value)}
              >
                <option value="">Any Experience</option>
                <option value="1">1+ Years</option>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Notice Period</label>
              <select
                value={filters.noticePeriod}
                onChange={(e) => onFilterChange('noticePeriod', e.target.value)}
              >
                <option value="">Any Period</option>
                <option value="Immediate">Immediate Joiner</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="90 Days">90 Days</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Max Salary Expectation</label>
              <select
                value={filters.salary}
                onChange={(e) => onFilterChange('salary', e.target.value)}
              >
                <option value="">Any Salary</option>
                <option value="5">Up to ₹5L</option>
                <option value="10">Up to ₹10L</option>
                <option value="15">Up to ₹15L</option>
                <option value="20">Up to ₹20L</option>
                <option value="30">Up to ₹30L+</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;
