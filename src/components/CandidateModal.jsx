import React from 'react';
import { FiX, FiMapPin, FiBriefcase, FiPhone } from 'react-icons/fi';

const GmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.39l-9 6.58-9-6.58V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.42.17-.8.45-1.09.28-.27.66-.41 1.05-.41H3l9 6.58L21 3h1.5c.39 0 .77.14 1.05.41.28.29.45.67.45 1.09z" fill="#EA4335"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12.031 2C6.446 2 1.923 6.533 1.923 12.127c0 1.73.437 3.419 1.267 4.915L1.031 22l5.088-1.34c1.442.788 3.064 1.204 4.717 1.204h.005c5.584 0 10.107-4.533 10.107-10.127 0-2.711-1.053-5.258-2.964-7.173C16.073 2.848 13.52 2 12.031 2zm5.867 14.286c-.26.737-1.286 1.342-2.126 1.488-.636.11-1.464.2-4.26-.957-3.575-1.48-5.889-5.116-6.068-5.353-.179-.238-1.458-1.944-1.458-3.71s.918-2.637 1.246-2.994c.328-.358.716-.447.955-.447H7.13c.238 0 .56.023.85.716.299.716 1.022 2.492 1.112 2.67.09.179.149.388.03.627-.119.239-.17.388-.35.597-.18.209-.387.464-.552.627-.188.188-.384.394-.165.77.219.375.972 1.607 2.086 2.597 1.432 1.272 2.636 1.666 3.023 1.846.388.179.613.149.837-.11s.955-1.113 1.209-1.492c.254-.379.508-.314.85-.19.344.125 2.18.1.03.627-.119.239-.17.388-.35.597-.18.209-.387.464-.552.627-.188.188-.384.394-.165.77.219.375.972 1.607 2.086 2.597.314.125 2.18 1.03 2.449 1.149.269.119.448.179.627.03s.776-.9 1.194-1.439l.067-.087z" fill="#25D366"/>
  </svg>
);

const CandidateModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const { name, role, location, experience, bio, skills, contact } = candidate;
  
  const email = contact?.email || 'email@example.com';
  const phone = contact?.phone || '+91 98765 43210';
  const whatsappNumber = phone.replace(/\D/g, ''); // Remove non-digits for WA link

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
                <span><FiMapPin size={18} /> {location}</span>
                <span><FiBriefcase size={18} /> {experience}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <section className="profile-section">
            <h3 className="section-title">About</h3>
            <p className="text-muted" style={{ lineHeight: '1.6' }}>{bio || "An experienced professional with a strong track record of success in their field. Passionate about innovation and delivering high-quality results."}</p>
          </section>

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
              <a href={`mailto:${email}`} className="contact-btn gmail-btn">
                <GmailIcon />
                <span>Email via Gmail</span>
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp-btn">
                <WhatsAppIcon />
                <span>Message on WhatsApp</span>
              </a>
              <a href={`tel:${phone}`} className="contact-btn call-btn">
                <FiPhone size={20} />
                <span>Call Candidate</span>
              </a>
            </div>
          </section>
        </div>

        <div className="modal-footer" style={{ padding: 'var(--spacing-6) var(--spacing-8)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-4)' }}>
          <button className="btn btn-outline" style={{ borderRadius: 'var(--radius-full)', padding: 'var(--spacing-3) var(--spacing-8)' }} onClick={onClose}>Close Profile</button>
          <button className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: 'var(--spacing-3) var(--spacing-8)' }}>Schedule Interview</button>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
