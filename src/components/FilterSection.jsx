import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FiFilter, FiChevronDown, FiX, FiSearch, FiClock } from 'react-icons/fi';
import SearchableDropdown from './SearchableDropdown';
import { getIndianStates, getCitiesOfState, getStateNameByCode, fetchLocalitiesFromDB, fetchLocalitiesFromGeoapify } from '../api/localityService';

const TRY_SEARCHING_FOR = [
  'Python Developer',
  'Java Developer',
  'React Developer',
  'Full Stack Developer',
  'Data Scientist'
];

const FilterSection = ({ filters, onFilterChange, onClearAll, onClearSearch, showAdvanced, setShowAdvanced, fetchSuggestions, allCandidates }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [localityOptions, setLocalityOptions] = useState([]);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const dropdownRef = useRef(null);

  const experienceOptions = ['Any Experience', '0-2 Yrs', '2-5 Yrs', '5-10 Yrs', '10+ Yrs'];
  const salaryOptions = ['Any Salary', '3-6 LPA', '6-10 LPA', '10+ LPA'];
  const workModeOptions = ['Any Work Mode', 'Remote', 'On-site', 'Hybrid'];
  const noticePeriodOptions = ['Any Notice Period', '15 days', '30 days', '60 days'];

  // Get all Indian states (memoized — computed once)
  const stateOptions = useMemo(() => getIndianStates(), []);

  // Get cities/districts for the selected state
  const cityOptions = useMemo(() => {
    if (!filters.location) return [];
    return getCitiesOfState(filters.location);
  }, [filters.location]);

  // Build dynamic Job Role options from all candidates
  const jobRoleOptions = useMemo(() => {
    if (!allCandidates || allCandidates.length === 0) return [];
    const roles = [...new Set(allCandidates.map(c => c.jobRole || c.role).filter(Boolean))];
    return roles.sort().map(r => ({ label: r, value: r }));
  }, [allCandidates]);

  // Build dynamic Skills options from all candidates
  const skillOptions = useMemo(() => {
    if (!allCandidates || allCandidates.length === 0) return [];
    const skillSet = new Set();
    allCandidates.forEach(c => {
      const skills = typeof c.skills === 'string'
        ? c.skills.split(',').map(s => s.trim())
        : Array.isArray(c.skills) ? c.skills : [];
      skills.forEach(s => { if (s) skillSet.add(s); });
    });
    return [...skillSet].sort().map(s => ({ label: s, value: s }));
  }, [allCandidates]);

  // Fetch localities from DB when district/city changes
  useEffect(() => {
    if (!filters.district) {
      setLocalityOptions([]);
      return;
    }
    let cancelled = false;
    setLoadingLocalities(true);
    const stateName = getStateNameByCode(filters.location);
    
    // Try Geoapify first, then fallback to DB
    const loadLocalities = async () => {
      try {
        let opts = await fetchLocalitiesFromGeoapify(filters.district, stateName);
        
        // If Geoapify returns nothing, try the backend DB
        if (opts.length === 0) {
          opts = await fetchLocalitiesFromDB(stateName, filters.district);
        }
        
        if (!cancelled) {
          setLocalityOptions(opts);
        }
      } catch (err) {
        console.error("Locality fetch error:", err);
      } finally {
        if (!cancelled) {
          setLoadingLocalities(false);
        }
      }
    };

    loadLocalities();
    return () => { cancelled = true; };
  }, [filters.district, filters.location]);


  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debouncing
  useEffect(() => {
    const query = filters.searchQuery || '';
    if (query.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await fetchSuggestions(query);
      setSuggestions(results || []);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.searchQuery, fetchSuggestions]);

  const handleSuggestionClick = (suggestion) => {
    addKeyword(suggestion);
  };

  const addKeyword = (kw) => {
    if (!kw || !kw.trim()) return;
    const kwTrimmed = kw.trim();
    const currentKeywords = filters.keywords || [];
    if (!currentKeywords.includes(kwTrimmed)) {
      const updated = [...currentKeywords, kwTrimmed];
      onFilterChange('keywords', updated);
      
      // Save to recent
      const recentUpdated = [kwTrimmed, ...recentSearches.filter(s => s !== kwTrimmed)].slice(0, 5);
      setRecentSearches(recentUpdated);
      localStorage.setItem('recent_searches', JSON.stringify(recentUpdated));
    }
    onFilterChange('searchQuery', ''); 
    setShowSuggestions(false);
  };

  const removeKeyword = (kwToRemove) => {
    const updated = (filters.keywords || []).filter(kw => kw !== kwToRemove);
    onFilterChange('keywords', updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword(filters.searchQuery);
    } else if (e.key === 'Backspace' && !filters.searchQuery && filters.keywords?.length > 0) {
      removeKeyword(filters.keywords[filters.keywords.length - 1]);
    }
  };

  const clearRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  // When state changes, reset district and locality
  const handleStateChange = (stateIsoCode) => {
    onFilterChange('location', stateIsoCode);
    onFilterChange('district', '');
    onFilterChange('locality', '');
  };

  // When district changes, reset locality
  const handleCityChange = (city) => {
    onFilterChange('district', city);
    onFilterChange('locality', '');
  };

  const handleLocalityChange = (loc) => {
    onFilterChange('locality', loc);
  };

  return (
    <div className="w-full mb-6 max-w-4xl mx-auto">
      {/* Main Search Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-visible relative" ref={dropdownRef}>
        <div className="flex p-1.5 items-center">
          <div className="relative flex-1 flex flex-wrap items-center gap-2 pl-11 pr-4 min-h-[48px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            
            {/* Selected Keyword Chips */}
            {(filters.keywords || []).map((kw, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-sm font-bold border border-blue-100 animate-scale-in"
              >
                {kw}
                <button 
                  onClick={() => removeKeyword(kw)}
                  className="hover:text-red-500 transition-colors"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}

            <input
              type="text"
              placeholder={filters.keywords?.length > 0 ? "" : "Search here"}
              className="flex-1 min-w-[120px] py-2 bg-transparent border-none focus:ring-0 outline-none text-gray-700 text-sm placeholder:text-gray-400"
              value={filters.searchQuery || ''}
              onChange={(e) => {
                onFilterChange('searchQuery', e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />

            {/* Clear All Search (X) button */}
            {((filters.keywords && filters.keywords.length > 0) || (filters.searchQuery && filters.searchQuery.trim())) && (
              <button
                onClick={onClearSearch}
                className="flex-shrink-0 p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                title="Clear search"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Professional Multi-section Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 py-4 max-h-[85vh] overflow-y-auto animate-fade-in">
            {/* Recent Searches */}
            {recentSearches.length > 0 && filters.searchQuery?.length === 0 && (
              <div className="mb-6">
                <div className="px-5 mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Recent</span>
                  <button onClick={clearRecent} className="text-[11px] font-bold text-blue-500 hover:text-blue-700">Clear</button>
                </div>
                {recentSearches.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-5 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-4 group transition-colors"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <FiClock className="text-gray-300 group-hover:text-blue-500 text-sm" />
                    <span className="text-[15px] text-gray-600 group-hover:text-gray-900 font-medium">{item}</span>
                  </div>
                ))}
                <div className="h-px bg-gray-50 mx-5 mt-4"></div>
              </div>
            )}

            {/* Dynamic Results or Recommendations */}
            <div className="">
              <div className="px-5 mb-3">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  {suggestions.length > 0 ? 'Suggestions' : 'Try Searching For'}
                </span>
              </div>

              {(suggestions.length > 0 ? suggestions : TRY_SEARCHING_FOR).map((item, idx) => (
                <div
                  key={idx}
                  className="px-5 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-4 group transition-colors"
                  onClick={() => handleSuggestionClick(item)}
                >
                  <FiSearch className="text-gray-300 group-hover:text-blue-500 text-sm" />
                  <span className="text-[15px] text-gray-700 group-hover:text-gray-900 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between px-2">
        <button
          className={`flex items-center gap-2 text-xs font-semibold transition-colors ${showAdvanced ? 'text-blue-600' : 'text-blue-500 hover:text-blue-700'}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <FiFilter className={showAdvanced ? 'animate-bounce' : ''} />
          Advanced Filters
          <FiChevronDown className={`transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        <button className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors" onClick={onClearAll}>Clear All</button>
      </div>

      {/* Collapsible Advanced Filters */}
      {showAdvanced && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 animate-slide-in">
          {/* State (Searchable) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">State</label>
            <SearchableDropdown
              label="State"
              options={stateOptions}
              value={filters.location}
              onChange={handleStateChange}
              placeholder="Select State"
            />
          </div>

          {/* District / City (Searchable — appears after state is selected) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">District / City</label>
            <SearchableDropdown
              label="District"
              options={cityOptions}
              value={filters.district}
              onChange={handleCityChange}
              placeholder={filters.location ? 'Select District' : 'Select state first'}
            />
          </div>

          {/* Locality (Searchable — fetched from DB for selected district) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Locality</label>
            <SearchableDropdown
              label="Locality"
              options={localityOptions}
              value={filters.locality}
              onChange={handleLocalityChange}
              placeholder={
                !filters.district
                  ? 'Select district first'
                  : loadingLocalities
                    ? 'Loading...'
                    : localityOptions.length === 0
                      ? 'No localities found'
                      : 'Select Locality'
              }
            />
          </div>


          {/* Experience Level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Experience Level</label>
            <select
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-700 text-xs rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-2.5 outline-none transition-all"
              value={filters.experience}
              onChange={(e) => onFilterChange('experience', e.target.value)}
            >
              {experienceOptions.map(opt => (
                <option key={opt} value={opt === 'Any Experience' ? '' : opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Work Mode */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Work Mode</label>
            <select
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-700 text-xs rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-2.5 outline-none transition-all"
              value={filters.workMode}
              onChange={(e) => onFilterChange('workMode', e.target.value)}
            >
              {workModeOptions.map(opt => (
                <option key={opt} value={opt === 'Any Work Mode' ? '' : opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Salary Range */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Salary Range</label>
            <select
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-700 text-xs rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-2.5 outline-none transition-all"
              value={filters.salaryRange}
              onChange={(e) => onFilterChange('salaryRange', e.target.value)}
            >
              {salaryOptions.map(opt => (
                <option key={opt} value={opt === 'Any Salary' ? '' : opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Notice Period */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notice Period</label>
            <select
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-700 text-xs rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-2.5 outline-none transition-all"
              value={filters.noticePeriod}
              onChange={(e) => onFilterChange('noticePeriod', e.target.value)}
            >
              {noticePeriodOptions.map(opt => (
                <option key={opt} value={opt === 'Any Notice Period' ? '' : opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Education */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Education</label>
            <select
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-700 text-xs rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-2.5 outline-none transition-all"
              value={filters.education}
              onChange={(e) => onFilterChange('education', e.target.value)}
            >
              <option value="">Any Education</option>
              <option value="B.E">B.E</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.E">M.E</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MBA">MBA</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
              <option value="ITI">ITI</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Job Role (Searchable) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Job Role</label>
            <SearchableDropdown
              label="Job Role"
              options={jobRoleOptions}
              value={filters.jobRole}
              onChange={(val) => onFilterChange('jobRole', val)}
              placeholder="Select Job Role"
            />
          </div>

          {/* Skills (Searchable) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Skills</label>
            <SearchableDropdown
              label="Skill"
              options={skillOptions}
              value={filters.skillFilter}
              onChange={(val) => onFilterChange('skillFilter', val)}
              placeholder="Select Skill"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
