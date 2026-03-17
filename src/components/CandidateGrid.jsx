import React from 'react';
import CandidateCard from './CandidateCard';

const CandidateGrid = ({ candidates, onSelectCandidate }) => {
  return (
    <div className="candidates-grid-container">
      <div className="grid-header">
        <h2 className="results-count">Found <span>{candidates.length}</span> candidates</h2>
        <div className="grid-actions">
          <span>Sort by:</span>
          <select className="sort-select">
            <option>Relevance</option>
            <option>Salary: Low to High</option>
            <option>Salary: High to Low</option>
            <option>Experience</option>
          </select>
        </div>
      </div>

      <div className="candidate-grid">
        {candidates.map(candidate => (
          <CandidateCard 
            key={candidate.id} 
            candidate={candidate} 
            onViewProfile={() => onSelectCandidate(candidate)}
          />
        ))}
      </div>

    </div>
  );
};

export default CandidateGrid;
