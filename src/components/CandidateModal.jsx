import React from 'react';
import { FiX, FiMapPin, FiBriefcase, FiPhone } from 'react-icons/fi';


const GmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.39l-9 6.58-9-6.58V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.42.17-.8.45-1.09.28-.27.66-.41 1.05-.41H3l9 6.58L21 3h1.5c.39 0 .77.14 1.05.41.28.29.45.67.45 1.09z" fill="#EA4335"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.82 2.49 15.53 3.33 17.01L2 22L7.17 20.73C8.57 21.57 10.22 22.06 12 22.06C17.52 22.06 22 17.58 22 12.06C22 6.54 17.52 2.06 11.99 2.06L12 2ZM17.15 15.39C16.94 16.01 15.98 16.51 15.31 16.65C14.84 16.75 14.23 16.82 12.18 15.97C9.56 14.89 7.87 12.22 7.74 12.04C7.61 11.86 6.66 10.6 6.66 9.3C6.66 8 7.33 7.34 7.6 7.07C7.81 6.86 8.17 6.75 8.48 6.75C8.58 6.75 8.67 6.75 8.75 6.76C9 6.77 9.15 6.78 9.33 7.21C9.56 7.77 10.11 9.12 10.18 9.26C10.25 9.4 10.32 9.59 10.22 9.78C10.13 9.97 10.05 10.07 9.9 10.24C9.76 10.41 9.61 10.61 9.47 10.78C9.33 10.95 9.17 11.13 9.35 11.44C9.53 11.75 10.14 12.74 11.04 13.54C12.2 14.58 13.15 14.91 13.46 15.04C13.77 15.17 13.95 15.14 14.13 14.93C14.31 14.72 14.91 14.02 15.12 13.72C15.33 13.42 15.53 13.47 15.82 13.58C16.11 13.69 17.65 14.45 17.96 14.61C18.27 14.77 18.47 14.85 18.55 14.98C18.63 15.11 18.63 15.73 18.42 16.35L17.15 15.39Z" fill="#25D366"/>
  </svg>
);

const CandidateModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const { 
    name, role, location, locality, experience, bio, skills, email, phone, whatsapp, 
    expectedSalary, subLocality, workMode, education, noticePeriod 
  } = candidate;
  
  const finalEmail = email || 'not-provided@example.com';
  const finalPhone = phone || '';
  const finalWhatsApp = (whatsapp || phone || '').replace(/\D/g, ''); 

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>

        <div className="modal-header">
          <div className="card-user-info">
            <div className="card-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
              {name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="card-details">
              <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>{name}</h2>
              <p className="card-role" style={{ fontSize: '1.1rem' }}>{role}</p>
              <div className="card-meta">
                <span><FiMapPin size={18} /> {[location, locality, subLocality].filter(Boolean).join(', ')}</span>
                <span><FiBriefcase size={18} /> {experience}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
            {expectedSalary && (
              <div className="profile-detail-item">
                <h3 className="section-title" style={{ marginBottom: '8px' }}>Expected Salary</h3>
                <p className="text-main" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {expectedSalary >= 100000 ? Math.round(expectedSalary / 100000) : expectedSalary} LPA
                </p>
              </div>
            )}
            
            {noticePeriod && (
              <div className="profile-detail-item">
                <h3 className="section-title" style={{ marginBottom: '8px' }}>Notice Period</h3>
                <p className="text-main" style={{ fontSize: '1.1rem' }}>{noticePeriod}</p>
              </div>
            )}

            {workMode && (
              <div className="profile-detail-item">
                <h3 className="section-title" style={{ marginBottom: '8px' }}>Work Mode</h3>
                <p className="text-main" style={{ fontSize: '1.1rem' }}>{workMode}</p>
              </div>
            )}

            {education && (
              <div className="profile-detail-item">
                <h3 className="section-title" style={{ marginBottom: '8px' }}>Education</h3>
                <p className="text-main" style={{ fontSize: '1.1rem' }}>{education}</p>
              </div>
            )}

            {location && (
              <div className="profile-detail-item">
                <h3 className="section-title" style={{ marginBottom: '8px' }}>State</h3>
                <p className="text-main" style={{ fontSize: '1.1rem' }}>{location}</p>
              </div>
            )}

            {locality && (
              <div className="profile-detail-item">
                <h3 className="section-title" style={{ marginBottom: '8px' }}>City / District</h3>
                <p className="text-main" style={{ fontSize: '1.1rem' }}>{locality}</p>
              </div>
            )}

            {subLocality && (
              <div className="profile-detail-item">
                <h3 className="section-title" style={{ marginBottom: '8px' }}>Locality</h3>
                <p className="text-main" style={{ fontSize: '1.1rem' }}>{subLocality}</p>
              </div>
            )}
          </div>

          <section className="profile-section">
            <h3 className="section-title">Skills & Expertise</h3>
            <div className="card-tags">
              {skills.map((skill, index) => (
                <span key={index} className="chip" style={{ padding: '8px 16px', fontSize: 'var(--font-size-sm)' }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <h3 className="section-title">Professional Contact</h3>
            <div className="direct-contact-actions">
              {finalEmail && (
                <a href={`mailto:${finalEmail}`} className="contact-btn gmail-btn" title="Email via Gmail">
                  <GmailIcon />
                </a>
              )}
              {finalWhatsApp && (
                <a href={`https://wa.me/${finalWhatsApp}`} target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp-btn" title="Message on WhatsApp">
                  <WhatsAppIcon />
                </a>
              )}
              {finalPhone && (
                <a href={`tel:${finalPhone}`} className="contact-btn call-btn" title="Call Candidate">
                  <FiPhone size={20} />
                </a>
              )}
            </div>
          </section>


        </div>

        <div className="modal-footer" style={{ padding: 'var(--spacing-6) var(--spacing-8)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-4)' }}>
          <button className="btn btn-outline" style={{ borderRadius: 'var(--radius-full)', padding: 'var(--spacing-3) var(--spacing-8)' }} onClick={onClose}>Close Profile</button>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
