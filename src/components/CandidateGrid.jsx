import React from 'react';
import CandidateCard from './CandidateCard';

const CandidateGrid = ({ candidates, onSelectCandidate }) => {
  return (
    <div className="candidates-container mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
