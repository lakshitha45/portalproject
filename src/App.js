import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import FilterSection from './components/FilterSection';
import CandidateGrid from './components/CandidateGrid';
import CandidateModal from './components/CandidateModal';
import useCandidates from './hooks/useCandidates';

// Import CSS
import './css/layout.css';
import './css/components.css';
import './css/modal.css';
import './css/animations.css';

function App() {
  const { candidates, loading, error, applyFilters, fetchSuggestions } = useCandidates();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filters, setFilters] = useState({
    keywords: ['Java'],
    location: '',
    locality: '',
    role: '',
    noticePeriod: '',
    experience: '',
    salary: '',
    searchQuery: ''
  });

  // Re-apply filters whenever filter state or candidates change
  React.useEffect(() => {
    if (!loading && (candidates.length > 0 || (candidates.length === 0 && !loading))) {
      applyFilters(filters);
    }
  }, [filters, loading]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRemoveKeyword = (keyword) => {
    setFilters(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleClearAll = () => {
    setFilters({
      keywords: [],
      location: '',
      locality: '',
      role: '',
      noticePeriod: '',
      experience: '',
      salary: '',
      searchQuery: ''
    });
  };

  return (
    <div className="app-container">
      <Sidebar />
      
      <main className="main-content">
        <Header 
          searchQuery={filters.searchQuery}
          onSearchChange={(val) => handleFilterChange('searchQuery', val)}
          fetchSuggestions={fetchSuggestions}
          onSelectCandidate={setSelectedCandidate}
        />
        
        <div className="page-container">
          <HeroBanner />
          
          <FilterSection 
            filters={filters}
            onFilterChange={handleFilterChange}
            onRemoveKeyword={handleRemoveKeyword}
            onClearAll={handleClearAll}
          />
          
          {loading ? (
            <div className="loading-state" style={{ padding: 'var(--spacing-12)', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading talented candidates...
            </div>
          ) : error ? (
            <div className="error-state">Error: {error}</div>
          ) : (
            <CandidateGrid candidates={candidates} onSelectCandidate={setSelectedCandidate} />
          )}
        </div>
      </main>

      {selectedCandidate && (
        <CandidateModal 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
        />
      )}
    </div>
  );
}

export default App;
