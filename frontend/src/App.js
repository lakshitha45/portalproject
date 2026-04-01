import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FilterSection from './components/FilterSection';
import CandidateGrid from './components/CandidateGrid';
import CandidateModal from './components/CandidateModal';
import useCandidates from './hooks/useCandidates';

// Import CSS
import './css/layout.css';
import './css/components.css';
import './css/modal.css';
import './css/animations.css';
import './css/searchable-dropdown.css';

function App() {
  const { candidates, allCandidates, loading, error, applyFilters, fetchSuggestions } = useCandidates();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    keywords: [],
    location: '',
    district: '',
    locality: '',
    role: '',
    noticePeriod: '',
    experience: '',
    salaryRange: '',
    salary: '',
    workMode: '',
    education: '',
    jobRole: '',
    skillFilter: '',
    searchQuery: ''
  });

  // Re-apply filters whenever filter state changes
  React.useEffect(() => {
    applyFilters(filters);
  }, [filters, applyFilters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear All => only resets advanced filters, keeps search text/keywords
  const handleClearAll = () => {
    setFilters(prev => ({
      ...prev,
      location: '',
      district: '',
      locality: '',
      role: '',
      noticePeriod: '',
      experience: '',
      salaryRange: '',
      salary: '',
      workMode: '',
      education: '',
      jobRole: '',
      skillFilter: ''
    }));
  };

  // Clear Search => only resets keywords and searchQuery
  const handleClearSearch = () => {
    setFilters(prev => ({
      ...prev,
      keywords: [],
      searchQuery: ''
    }));
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="content-area">
          <FilterSection 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            onClearSearch={handleClearSearch}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            fetchSuggestions={fetchSuggestions}
            allCandidates={allCandidates}
          />
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Finding the best candidates for you...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>Oops! {error}</p>
              <button onClick={() => applyFilters(filters)}>Try Again</button>
            </div>
          ) : (
            <CandidateGrid 
              candidates={candidates}
              onSelectCandidate={setSelectedCandidate}
            />
          )}
        </div>
      </div>

      {selectedCandidate && (
        <CandidateModal 
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onSelectCandidate={setSelectedCandidate}
        />
      )}
    </div>
  );
}

export default App;
