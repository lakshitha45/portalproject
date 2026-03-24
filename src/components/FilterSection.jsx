import React from 'react';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

const FilterSection = ({ filters, onFilterChange, onClearAll, onRemoveKeyword, showAdvanced, setShowAdvanced }) => {
  
  const experienceOptions = ['0-2 Yrs', '2-5 Yrs', '5-10 Yrs', '10+ Yrs'];
  const salaryOptions = ['3-6 LPA', '6-10 LPA', '10+ LPA'];

  return (
    <div className="filter-section animate-fade-in">
      <div className="filter-main">
        <div className="search-with-filters">
          <div className="active-search-keywords">
            <span className="label">ACTIVE SEARCH KEYWORDS</span>
            <div className="keyword-tags">
              {filters.keywords && filters.keywords.length > 0 ? (
                filters.keywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">
                    {keyword} <FiX onClick={() => onRemoveKeyword(keyword)} />
                  </span>
                ))
              ) : (
                <span className="no-keywords">No active keywords</span>
              )}
            </div>
          </div>

          <div className="filter-actions">
            <button
              className={`advanced-toggle-btn ${showAdvanced ? 'active' : ''}`}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <FiFilter /> Advanced Filters 
              <span className="filter-count">1 Active</span>
              <FiChevronDown className={showAdvanced ? 'up' : ''} />
            </button>
            <button className="clear-all-btn" onClick={onClearAll}>Clear All</button>
          </div>
        </div>

        {showAdvanced && (
          <div className="advanced-filters-container animate-slide-in">
            <div className="filter-grid">
              <div className="filter-column">
                <label className="filter-label">Experience</label>
                <div className="chip-group">
                  {experienceOptions.map(option => (
                    <button 
                      key={option}
                      className={`filter-chip ${filters.experience === option ? 'active' : ''}`}
                      onClick={() => onFilterChange('experience', filters.experience === option ? '' : option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-column">
                <label className="filter-label">Location (State)</label>
                <select 
                  className="filter-select"
                  value={filters.location}
                  onChange={(e) => onFilterChange('location', e.target.value)}
                >
                  <option value="">Select State</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Telangana">Telangana</option>
                </select>
              </div>

              <div className="filter-column">
                <label className="filter-label">Expected Salary</label>
                <div className="chip-group">
                  {salaryOptions.map(option => (
                    <button 
                      key={option}
                      className={`filter-chip ${filters.salaryRange === option ? 'active' : ''}`}
                      onClick={() => onFilterChange('salaryRange', filters.salaryRange === option ? '' : option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;
