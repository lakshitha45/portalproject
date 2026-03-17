import React from 'react';
import { FiMapPin, FiBriefcase, FiBookmark, FiFileText, FiMail, FiUser } from 'react-icons/fi';

const CandidateCard = ({ candidate, onViewProfile }) => {
  const { name, role, location, experience, salaryRange, skills, noticePeriod } = candidate;

  return (
    <div 
      className="candidate-card animate-fade-in clickable-card" 
      onClick={onViewProfile}
    >
      <div className="card-header">
        <div className="card-user-info">
          <div className="card-avatar">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="card-details">
            <h3>{name}</h3>
            <p className="card-role">{role}</p>
            <div className="card-meta">
              <span><FiMapPin size={14} /> {location}</span>
              <span><FiBriefcase size={14} /> {experience}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-stats">
        <div className="notice-chip chip-gray chip">
          {noticePeriod}
        </div>
        <div className="card-salary">
          <span className="salary-label">Expected Range</span>
          <span className="salary-range">₹{salaryRange}</span>
        </div>
      </div>

      <div className="card-tags">
        {skills.slice(0, 5).map((skill, index) => (
          <span key={index} className="chip">
            {skill}
          </span>
        ))}
        {skills.length > 5 && <span className="chip chip-gray">+{skills.length - 5} more</span>}
      </div>
      
      <div className="card-action-hint">
        Click to view full profile & contact info
      </div>
    </div>
  );
};

export default CandidateCard;
