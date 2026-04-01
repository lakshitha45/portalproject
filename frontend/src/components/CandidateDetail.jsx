import React from 'react';
import { FiMapPin, FiBriefcase, FiX } from 'react-icons/fi';

const GmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
    <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
    <path fill="#34A853" d="M0 5.457v13.909c0 .904.732 1.636 1.636 1.636h3.819V11.73L0 7.09V5.457z"/>
    <path fill="#4285F4" d="M24 5.457v1.636l-5.455 4.637v9.091h3.819A1.636 1.636 0 0024 19.185V5.457z"/>
    <path fill="#FBBC05" d="M0 7.09l5.455 4.637V4.64L3.927 3.493C2.31 2.28 0 3.434 0 5.457V7.09z"/>
    <path fill="#EA4335" d="M24 7.09l-5.455 4.637V4.64l1.528-1.147C21.69 2.28 24 3.434 24 5.457V7.09z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
    <path
      fill="#25D366"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
    />
  </svg>
);

const CandidateDetail = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const { name, jobRole, location, locality, experience, skills, contact, expectedSalary, noticePeriod } = candidate;
  
  const email = contact?.email || 'email@example.com';
  const phone = contact?.phone || '+91 98765 43210';
  const whatsappNumber = phone.replace(/\D/g, '');

  const skillsArray = typeof skills === 'string' 
    ? skills.split(',').map(s => s.trim()).filter(Boolean) 
    : (Array.isArray(skills) ? skills : []);

  return (
    <div className="detail-panel animate-fade-in">
      <div className="detail-panel-header">
        <h2 className="detail-name">{name}</h2>
        <button className="detail-close" onClick={onClose}><FiX size={18} /></button>
      </div>

      <div className="detail-role">{jobRole}</div>

      <div className="detail-meta">
        <span><FiMapPin size={14} /> {location}{locality ? ` - ${locality}` : ''}</span>
      </div>

      {expectedSalary && (
        <div className="detail-salary" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          {parseInt(expectedSalary) >= 100000 ? Math.round(parseInt(expectedSalary) / 100000) : expectedSalary} LPA
        </div>
      )}

      <div className="detail-section">
        <h3 className="detail-section-title">Experience</h3>
        <p>{experience} years</p>
      </div>

      {noticePeriod && (
        <div className="detail-section">
          <h3 className="detail-section-title">Notice Period</h3>
          <p>{noticePeriod}</p>
        </div>
      )}

      <div className="detail-section">
        <h3 className="detail-section-title">Skills & Expertise</h3>
        <div className="card-tags">
          {skillsArray.map((skill, index) => (
            <span key={index} className="chip">{skill}</span>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <h3 className="detail-section-title">Contact</h3>
        <div className="direct-contact-actions">
          <a href={`mailto:${email}`} className="contact-btn gmail-btn" title="Email via Gmail">
            <GmailIcon />
          </a>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp-btn" title="Message on WhatsApp">
            <WhatsAppIcon />
          </a>
          <a href={`tel:${phone}`} className="contact-btn call-btn" title="Call Candidate">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.89 9.11 19.79 19.79 0 01.82 4.48 2 2 0 012.82 2.3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.03z"/>
            </svg>
          </a>
        </div>
      </div>

    </div>
  );
};

export default CandidateDetail;
