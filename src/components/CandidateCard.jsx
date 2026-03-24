import React from 'react';
import { FiMapPin, FiBriefcase, FiBookmark, FiEye, FiFileText, FiMail } from 'react-icons/fi';

const CandidateCard = ({ candidate, onViewProfile }) => {
  const { name, role, location, experience, salaryRange, skills, noticePeriod } = candidate;

  // For demo purposes, we'll randomize or use specific values for the status badge
  const statusDays = noticePeriod === 'Immediate' ? 'Immediate' : noticePeriod.split(' ')[0] + ' days';

  return (
    <div className="candidate-card-v2 animate-fade-in">
      <div className="card-top-actions">
        <button className="bookmark-icon-btn">
          <FiBookmark size={18} />
        </button>
      </div>

      <div className="card-main-content">
        <div className="card-avatar-v2">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        
        <div className="card-info-v2">
          <h3 className="card-name-v2">{name}</h3>
          <p className="card-role-v2">{role || candidate.jobRole}</p>
          
          <div className="card-meta-v2">
            <span><FiMapPin size={14} /> {location}</span>
            <span><FiBriefcase size={14} /> {experience}</span>
          </div>

          <div className="card-badge-container">
            <span className="status-badge-v2">
              <span className="dot"></span> {statusDays}
            </span>
          </div>
        </div>
      </div>

      <div className="card-salary-info">
        <div className="salary-box">
          <span className="currency">₹</span>
          <span className="amount">{typeof salaryRange === 'string' ? salaryRange.match(/(\d+)/)?.[0] || salaryRange : salaryRange}.0</span>
        </div>
        <span className="salary-type">Expected Range</span>
      </div>

      <div className="card-skills-row">
        {skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="skill-tag-v2">{skill}</span>
        ))}
        {skills.length > 3 && <span className="skill-tag-v2 more">+{skills.length - 3}</span>}
      </div>

      <div className="card-footer-v2">
        <button className="view-profile-btn" onClick={onViewProfile}>
          <FiEye /> View Profile
        </button>
        <button className="action-icon-btn"><FiFileText /></button>
        <button className="action-icon-btn"><FiMail /></button>
      </div>
    </div>
  );
};

export default CandidateCard;
